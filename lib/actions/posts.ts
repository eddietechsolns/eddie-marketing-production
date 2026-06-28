"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function savePost(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const categoryIdStr = n(formData, "categoryId");
  const categoryId = categoryIdStr ? parseInt(categoryIdStr) : null;
  const publishedAtStr = n(formData, "publishedAt");

  const baseData = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    excerpt: n(formData, "excerpt"),
    content: n(formData, "content"),
    author: n(formData, "author"),
    status: n(formData, "status") ?? "draft",
    publishedAt: publishedAtStr ? new Date(publishedAtStr) : null,
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
  };

  try {
    if (id) {
      await prisma.blogPost.update({
        where: { id: parseInt(id) },
        data: {
          ...baseData,
          categories: categoryId ? { set: [{ id: categoryId }] } : { set: [] },
        },
      });
    } else {
      await prisma.blogPost.create({
        data: {
          ...baseData,
          ...(categoryId ? { categories: { connect: [{ id: categoryId }] } } : {}),
        },
      });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/posts");
}

export async function togglePostStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.blogPost.update({ where: { id }, data: { status } });
  revalidatePath("/admin/posts");
}
