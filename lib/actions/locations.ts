"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function saveLocation(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const data = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    city: n(formData, "city"),
    state: n(formData, "state"),
    excerpt: n(formData, "excerpt"),
    content: n(formData, "content"),
    status: n(formData, "status") ?? "draft",
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
  };

  try {
    if (id) {
      await prisma.location.update({ where: { id: parseInt(id) }, data });
    } else {
      await prisma.location.create({ data });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function deleteLocation(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.location.delete({ where: { id } });
  revalidatePath("/admin/locations");
}

export async function toggleLocationStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.location.update({ where: { id }, data: { status } });
  revalidatePath("/admin/locations");
}
