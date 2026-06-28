"use client";

import { useActionState, useState } from "react";
import { savePost } from "@/lib/actions/posts";
import type { BlogPost, Category } from "@prisma/client";

import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

interface Props {
  post?: BlogPost & { categories: Category[] };
  categories: Category[];
}

export default function PostForm({ post, categories }: Props) {
  const [state, action, pending] = useActionState(savePost, { error: null });
  const [slug, setSlug] = useState(post?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required>
        <Input
          name="title"
          required
          defaultValue={post?.title ?? ""}
          onChange={(e) => { if (!post) setSlug(slugify(e.target.value)); }}
          placeholder="Post title"
        />
      </FormField>

      <FormField label="Slug" name="slug" required>
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="post-slug"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Author" name="author">
          <Input name="author" defaultValue={post?.author ?? ""} placeholder="Author name" />
        </FormField>
        <FormField label="Category" name="categoryId">
          <Select name="categoryId" defaultValue={post?.categories[0]?.id?.toString() ?? ""}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Excerpt" name="excerpt">
        <Textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} placeholder="Short description..." />
      </FormField>

      <FormField label="Content" name="content">
        <Textarea name="content" rows={12} defaultValue={post?.content ?? ""} placeholder="Post content..." />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status" name="status">
          <Select name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </FormField>
        <FormField label="Published Date" name="publishedAt">
          <Input name="publishedAt" type="date" defaultValue={formatDate(post?.publishedAt ?? null)} />
        </FormField>
      </div>

      <SeoFields seoTitle={post?.seoTitle} seoDescription={post?.seoDescription} canonicalUrl={post?.canonicalUrl} />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={post ? "Save Changes" : "Create Post"} />
        <a href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
      </div>
    </form>
  );
}
