"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function saveServiceCategory(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const data = {
    name: n(formData, "name") ?? "",
    slug: n(formData, "slug") ?? "",
    description: n(formData, "description"),
    status: n(formData, "status") ?? "published",
  };

  try {
    if (id) {
      await prisma.serviceCategory.update({ where: { id: parseInt(id) }, data });
    } else {
      await prisma.serviceCategory.create({ data });
    }
  } catch {
    return { error: "Failed to save. The name or slug may already be in use." };
  }

  revalidatePath("/admin/service-categories");
  redirect("/admin/service-categories");
}

export async function deleteServiceCategory(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.serviceCategory.delete({ where: { id } });
  revalidatePath("/admin/service-categories");
}

export async function toggleServiceCategoryStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.serviceCategory.update({ where: { id }, data: { status } });
  revalidatePath("/admin/service-categories");
}
