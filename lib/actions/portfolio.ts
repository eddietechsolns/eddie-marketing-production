"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function savePortfolio(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const servicesStr = n(formData, "services") ?? "";
  const services = servicesStr.split(",").map((s) => s.trim()).filter(Boolean);

  const categoryIdStr = n(formData, "categoryId");
  const categoryId = categoryIdStr ? parseInt(categoryIdStr) : null;

  const industryIds = formData
    .getAll("industryId")
    .map((v) => parseInt(v.toString()))
    .filter((v) => !isNaN(v));

  const locationIds = formData
    .getAll("locationId")
    .map((v) => parseInt(v.toString()))
    .filter((v) => !isNaN(v));

  const baseData = {
    title: n(formData, "title") ?? "",
    slug: n(formData, "slug") ?? "",
    client: n(formData, "client"),
    excerpt: n(formData, "excerpt"),
    content: n(formData, "content"),
    services,
    status: n(formData, "status") ?? "draft",
    seoTitle: n(formData, "seoTitle"),
    seoDescription: n(formData, "seoDescription"),
    canonicalUrl: n(formData, "canonicalUrl"),
  };

  try {
    if (id) {
      await prisma.portfolioProject.update({
        where: { id: parseInt(id) },
        data: {
          ...baseData,
          categoryId,
          industries: { set: industryIds.map((iid) => ({ id: iid })) },
          locations: { set: locationIds.map((lid) => ({ id: lid })) },
        },
      });
    } else {
      await prisma.portfolioProject.create({
        data: {
          ...baseData,
          categoryId,
          industries: { connect: industryIds.map((iid) => ({ id: iid })) },
          locations: { connect: locationIds.map((lid) => ({ id: lid })) },
        },
      });
    }
  } catch {
    return { error: "Failed to save. The slug may already be in use." };
  }

  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolio(id: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
}

export async function togglePortfolioStatus(id: number, currentStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const status = currentStatus === "published" ? "draft" : "published";
  await prisma.portfolioProject.update({ where: { id }, data: { status } });
  revalidatePath("/admin/portfolio");
}
