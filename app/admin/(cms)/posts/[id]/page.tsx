import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/forms/PostForm";

export const metadata: Metadata = { title: "Edit Post" };

interface Props { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id: parseInt(id) }, include: { categories: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">← Posts</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{post.title}</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PostForm post={post} categories={categories} />
      </div>
    </div>
  );
}
