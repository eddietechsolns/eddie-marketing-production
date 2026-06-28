"use server";

import { writeFile, readFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseWpXml, type WpItem } from "@/lib/wp-xml-parser";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PreviewRecord {
  wpId: number;
  type: string;
  title: string;
  slug: string;
  slugSource: "wp:post_name" | "legacyUrl" | "title";
  legacyUrl: string;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  categories: string[];
  metaKeys: string[];
}

export type ImportState =
  | { step: "idle"; error?: string | null }
  | {
      step: "preview";
      previewId: string;
      records: PreviewRecord[];
      totalCategories: number;
      error?: string | null;
    }
  | { step: "done"; imported: number; updated: number; skipped: number; failed: string[] };

// ── Main action ──────────────────────────────────────────────────────────────

export async function handleWpImport(
  _prev: ImportState,
  formData: FormData
): Promise<ImportState> {
  const session = await getSession();
  if (!session) return { step: "idle", error: "Unauthorized" };

  const step = formData.get("step")?.toString() ?? "parse";

  if (step === "parse") return handleParse(formData);
  if (step === "import") return handleImport(formData);
  return { step: "idle", error: "Unknown step." };
}

// ── Step 1: Parse XML ────────────────────────────────────────────────────────

async function handleParse(formData: FormData): Promise<ImportState> {
  const file = formData.get("xmlFile") as File | null;

  if (!file || file.size === 0)
    return { step: "idle", error: "Please select a WordPress XML export file." };
  if (!file.name.toLowerCase().endsWith(".xml"))
    return { step: "idle", error: "File must be an .xml export from WordPress." };
  if (file.size > 50 * 1024 * 1024)
    return { step: "idle", error: "File too large (max 50 MB)." };

  let xmlText: string;
  try {
    xmlText = await file.text();
  } catch (e) {
    return { step: "idle", error: `Failed to read file: ${e instanceof Error ? e.message : String(e)}` };
  }

  let parsed;
  try {
    parsed = parseWpXml(xmlText);
  } catch (e) {
    return {
      step: "idle",
      error: `Could not parse XML: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  if (parsed.items.length === 0)
    return { step: "idle", error: "No importable content found (posts, pages, or portfolio items)." };

  const previewId = randomUUID();
  try {
    await writeFile(`/tmp/wp-import-${previewId}.json`, JSON.stringify(parsed), "utf-8");
    // Also keep the raw XML for diagnostic inspection (overwrite each upload)
    await writeFile("/tmp/wp-import-last.xml", xmlText, "utf-8");
  } catch (e) {
    return { step: "idle", error: `Failed to write temp file: ${e instanceof Error ? e.message : String(e)}` };
  }

  const records: PreviewRecord[] = parsed.items.map((item) => ({
    wpId: item.wpId,
    type: item.type,
    title: item.title,
    slug: item.slug,
    slugSource: item.slugSource,
    legacyUrl: item.legacyUrl,
    status: item.status,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    canonicalUrl: item.canonicalUrl,
    categories: item.categories,
    metaKeys: item.metaKeys,
  }));

  return {
    step: "preview",
    previewId,
    records,
    totalCategories: parsed.categories.length,
  };
}

// ── Step 2: Import selected records ─────────────────────────────────────────

async function handleImport(formData: FormData): Promise<ImportState> {
  const previewId = formData.get("previewId")?.toString();
  if (!previewId)
    return { step: "idle", error: "Preview session missing. Please upload the file again." };

  let parsed: { items: WpItem[]; categories: { wpId: number; name: string; slug: string }[] };
  try {
    const raw = await readFile(`/tmp/wp-import-${previewId}.json`, "utf-8");
    parsed = JSON.parse(raw);
  } catch {
    return { step: "idle", error: "Preview session expired. Please upload the file again." };
  }

  const importAll = formData.get("importAll") === "true";
  const updateExisting = formData.get("updateExisting") === "true";
  const selectedIds = formData.getAll("selectedId").map(Number).filter(Boolean);
  const targetSet = new Set(importAll ? parsed.items.map((i) => i.wpId) : selectedIds);

  if (targetSet.size === 0)
    return { step: "preview", previewId, records: [], totalCategories: 0, error: "Select at least one item to import." };

  // Upsert categories first so posts can connect to them
  for (const cat of parsed.categories) {
    if (!cat.slug || !cat.name) continue;
    try {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: { name: cat.name, slug: cat.slug },
      });
    } catch { /* ignore individual category errors */ }
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const item of parsed.items.filter((i) => targetSet.has(i.wpId))) {
    try {
      const isDupe =
        (await isDuplicateByWpId(item.type, item.wpId)) ||
        (item.legacyUrl ? await isDuplicateByUrl(item.type, item.legacyUrl) : false);

      if (isDupe) {
        if (updateExisting) {
          const result = await updateItemSeo(item);
          if (result === "updated") { updated++; } else { skipped++; }
        } else {
          skipped++;
        }
        continue;
      }

      await importItem(item);
      imported++;
    } catch (e) {
      failed.push(`"${item.title}": ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Clean up temp file
  try { await unlink(`/tmp/wp-import-${previewId}.json`); } catch { /* ignore */ }

  revalidatePath("/admin/migration");
  revalidatePath("/admin/migration/queue");

  return { step: "done", imported, updated, skipped, failed };
}

// ── SEO-only update for existing records ─────────────────────────────────────
// Updates seoTitle, seoDescription, canonicalUrl, ogTitle, ogDescription only.
// Never overwrites title, slug, content, excerpt, status, or author.

async function updateItemSeo(item: WpItem): Promise<"updated" | "not_found"> {
  const data = {
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    canonicalUrl: item.canonicalUrl,
    ogTitle: item.ogTitle,
    ogDescription: item.ogDescription,
    migrationNotes: `SEO refreshed from WordPress (WP ID: ${item.wpId})`,
  };

  const byWpId = { legacyWpId: item.wpId };
  const byUrl = item.legacyUrl ? { legacyUrl: item.legacyUrl } : null;
  const where = byUrl ? { OR: [byWpId, byUrl] } : byWpId;

  if (item.type === "post") {
    const rec = await prisma.blogPost.findFirst({ where, select: { id: true } });
    if (!rec) return "not_found";
    await prisma.blogPost.update({ where: { id: rec.id }, data });
    return "updated";
  }

  if (item.type === "page") {
    const rec = await prisma.page.findFirst({ where, select: { id: true } });
    if (!rec) return "not_found";
    await prisma.page.update({ where: { id: rec.id }, data });
    return "updated";
  }

  if (item.type === "portfolio") {
    const rec = await prisma.portfolioProject.findFirst({ where, select: { id: true } });
    if (!rec) return "not_found";
    await prisma.portfolioProject.update({ where: { id: rec.id }, data });
    return "updated";
  }

  return "not_found";
}

// ── Duplicate detection ──────────────────────────────────────────────────────

async function isDuplicateByWpId(type: string, wpId: number): Promise<boolean> {
  const sel = { select: { id: true } };
  if (type === "post") return !!(await prisma.blogPost.findFirst({ where: { legacyWpId: wpId }, ...sel }));
  if (type === "page") return !!(await prisma.page.findFirst({ where: { legacyWpId: wpId }, ...sel }));
  if (type === "portfolio") return !!(await prisma.portfolioProject.findFirst({ where: { legacyWpId: wpId }, ...sel }));
  return false;
}

async function isDuplicateByUrl(type: string, legacyUrl: string): Promise<boolean> {
  const sel = { select: { id: true } };
  if (type === "post") return !!(await prisma.blogPost.findFirst({ where: { legacyUrl }, ...sel }));
  if (type === "page") return !!(await prisma.page.findFirst({ where: { legacyUrl }, ...sel }));
  if (type === "portfolio") return !!(await prisma.portfolioProject.findFirst({ where: { legacyUrl }, ...sel }));
  return false;
}

// ── Item import ───────────────────────────────────────────────────────────────

async function uniqueSlug(
  check: (slug: string) => Promise<boolean>,
  base: string,
  wpId: number
): Promise<string> {
  const slug = base || `wp-import-${wpId}`;
  if (!(await check(slug))) return slug;
  const suffixed = `${slug}-${wpId}`;
  if (!(await check(suffixed))) return suffixed;
  return `${slug}-wp-${wpId}-${Date.now()}`;
}

async function importItem(item: WpItem): Promise<void> {
  const status = item.status === "publish" ? "published" : "draft";
  const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null;

  const base = {
    legacyWpId: item.wpId,
    legacyUrl: item.legacyUrl || null,
    title: item.title,
    content: item.content || null,
    excerpt: item.excerpt || null,
    status,
    seoTitle: item.seoTitle || null,
    seoDescription: item.seoDescription || null,
    canonicalUrl: item.canonicalUrl || null,
    ogTitle: item.ogTitle || null,
    ogDescription: item.ogDescription || null,
    featuredImage: item.featuredImageUrl || null,
    importStatus: "imported",
    migrationNotes: `Imported from WordPress (WP ID: ${item.wpId})`,
  };

  if (item.type === "post") {
    const slug = await uniqueSlug(
      (s) => prisma.blogPost.findUnique({ where: { slug: s } }).then(Boolean),
      item.slug,
      item.wpId
    );
    const categoryConnects = (
      await Promise.all(
        item.categories.map((name) =>
          prisma.category.findFirst({ where: { name }, select: { id: true } })
        )
      )
    ).filter((c): c is { id: number } => c !== null);

    await prisma.blogPost.create({
      data: {
        ...base,
        slug,
        author: item.author || null,
        publishedAt,
        categories: categoryConnects.length > 0 ? { connect: categoryConnects } : undefined,
      },
    });
    return;
  }

  if (item.type === "page") {
    const slug = await uniqueSlug(
      (s) => prisma.page.findUnique({ where: { slug: s } }).then(Boolean),
      item.slug,
      item.wpId
    );
    await prisma.page.create({ data: { ...base, slug } });
    return;
  }

  if (item.type === "portfolio") {
    const slug = await uniqueSlug(
      (s) => prisma.portfolioProject.findUnique({ where: { slug: s } }).then(Boolean),
      item.slug,
      item.wpId
    );
    await prisma.portfolioProject.create({ data: { ...base, slug } });
    return;
  }
}
