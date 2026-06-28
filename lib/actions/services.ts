"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function saveService(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const categoryIdStr = n(formData, "categoryId");
  const data = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    categoryId: categoryIdStr ? parseInt(categoryIdStr) : null,
    excerpt: n(formData, "excerpt"),
    content: n(formData, "content"),
    status: n(formData, "status") ?? "draft",
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
  };

  try {
    if (id) {
      await prisma.service.update({ where: { id: parseInt(id) }, data });
    } else {
      await prisma.service.create({ data });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}

export async function toggleServiceStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.service.update({ where: { id }, data: { status } });
  revalidatePath("/admin/services");
}
