"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

function nf(formData: FormData, key: string): number | null {
  const v = n(formData, key);
  if (!v) return null;
  const parsed = parseFloat(v);
  return isNaN(parsed) ? null : parsed;
}

export async function saveCaseStudy(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const idStr = n(formData, "id");
  const id = idStr ? parseInt(idStr) : null;
  const status = n(formData, "status") ?? "draft";

  let publishedAt: Date | null = null;
  if (status === "published") {
    if (id) {
      const existing = await prisma.caseStudy.findUnique({
        where: { id },
        select: { publishedAt: true },
      });
      publishedAt = existing?.publishedAt ?? new Date();
    } else {
      publishedAt = new Date();
    }
  }

  const galleryStr = n(formData, "galleryImages") ?? "";
  const galleryImages = galleryStr
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    status,
    clientName: n(formData, "clientName"),
    industry: n(formData, "industry"),
    country: n(formData, "country"),
    serviceType: n(formData, "serviceType"),
    challenge: n(formData, "challenge"),
    strategy: n(formData, "strategy"),
    implementation: n(formData, "implementation"),
    results: n(formData, "results"),
    testimonial: n(formData, "testimonial"),
    trafficIncreasePercent: nf(formData, "trafficIncreasePercent"),
    leadIncreasePercent: nf(formData, "leadIncreasePercent"),
    conversionIncreasePercent: nf(formData, "conversionIncreasePercent"),
    revenueGenerated: n(formData, "revenueGenerated"),
    featuredImage: n(formData, "featuredImage"),
    galleryImages,
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
    ogTitle: n(formData, "ogTitle"),
    ogDescription: n(formData, "ogDescription"),
    publishedAt,
  };

  try {
    if (id) {
      await prisma.caseStudy.update({ where: { id }, data });
    } else {
      await prisma.caseStudy.create({ data });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  redirect("/admin/case-studies");
}

export async function deleteCaseStudy(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.caseStudy.delete({ where: { id } });
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
}

export async function toggleCaseStudyStatus(
  id: number,
  currentStatus: string
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  const updateData: { status: string; publishedAt?: Date } = { status };
  if (status === "published") {
    const existing = await prisma.caseStudy.findUnique({
      where: { id },
      select: { publishedAt: true },
    });
    if (!existing?.publishedAt) updateData.publishedAt = new Date();
  }
  await prisma.caseStudy.update({ where: { id }, data: updateData });
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
}
