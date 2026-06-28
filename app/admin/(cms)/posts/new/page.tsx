import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/forms/PostForm";

export const metadata: Metadata = { title: "New Post" };

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">← Posts</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Post</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}
