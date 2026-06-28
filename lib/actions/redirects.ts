"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function n(formData: FormData, key: string): string | null {
  const v = formData.get(key)?.toString().trim();
  return v || null;
}

export async function saveRedirect(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const id = n(formData, "id");
  const sourceUrl = n(formData, "sourceUrl") ?? "";
  const targetUrl = n(formData, "targetUrl") ?? "";
  const statusCodeStr = n(formData, "statusCode");
  const statusCode = statusCodeStr ? parseInt(statusCodeStr) : 301;

  if (!sourceUrl) return { error: "Source URL is required" };
  if (!targetUrl) return { error: "Target URL is required" };

  const data = {
    sourceUrl,
    targetUrl,
    statusCode,
    notes: n(formData, "notes"),
  };

  try {
    if (id) {
      await prisma.redirect.update({ where: { id: parseInt(id) }, data });
    } else {
      await prisma.redirect.create({ data });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("Unique constraint")) return { error: "A redirect for this source URL already exists" };
    return { error: msg };
  }

  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function deleteRedirect(id: number): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.redirect.delete({ where: { id } });
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }

  revalidatePath("/admin/redirects");
  return { error: null };
}
