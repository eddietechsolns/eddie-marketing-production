"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveOverride(formData: FormData) {
  const clusterId = formData.get("clusterId");
  const pillar = formData.get("pillar");

  if (!clusterId || !pillar || typeof clusterId !== "string" || typeof pillar !== "string") return;

  const [contentKind, rawId] = pillar.split(":");
  const contentId = parseInt(rawId, 10);
  if (!contentKind || isNaN(contentId)) return;

  await prisma.pillarOverride.upsert({
    where: { clusterId },
    create: { clusterId, contentKind, contentId },
    update: { contentKind, contentId },
  });

  revalidatePath("/admin/seo/pillars");
}

export async function clearOverride(formData: FormData) {
  const clusterId = formData.get("clusterId");
  if (!clusterId || typeof clusterId !== "string") return;

  await prisma.pillarOverride.deleteMany({ where: { clusterId } });
  revalidatePath("/admin/seo/pillars");
}
