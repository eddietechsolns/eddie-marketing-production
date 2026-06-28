"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function savePage(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const data = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    content: n(formData, "content"),
    excerpt: n(formData, "excerpt"),
    status: n(formData, "status") ?? "draft",
    featuredImage: n(formData, "featuredImage"),
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
  };

  try {
    if (id) {
      await prisma.page.update({ where: { id: parseInt(id) }, data });
    } else {
      await prisma.page.create({ data });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePage(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
}

export async function togglePageStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.page.update({ where: { id }, data: { status } });
  revalidatePath("/admin/pages");
}
