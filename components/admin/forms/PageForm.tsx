"use client";

import { useActionState, useState } from "react";
import { savePage } from "@/lib/actions/pages";
import type { Page } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";
import RichTextEditor from "@/components/admin/RichTextEditor";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function PageForm({ page }: { page?: Page }) {
  const [state, action, pending] = useActionState(savePage, { error: null });
  const [slug, setSlug] = useState(page?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {page && <input type="hidden" name="id" value={page.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required>
        <Input
          name="title"
          required
          defaultValue={page?.title ?? ""}
          onChange={(e) => { if (!page) setSlug(slugify(e.target.value)); }}
          placeholder="Page title"
        />
      </FormField>

      <FormField label="Slug" name="slug" required hint="URL-friendly identifier (e.g. about-us)">
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="page-slug"
        />
      </FormField>

      <FormField label="Excerpt" name="excerpt">
        <Textarea name="excerpt" rows={2} defaultValue={page?.excerpt ?? ""} placeholder="Short description..." />
      </FormField>

      <FormField label="Content" name="content">
        <RichTextEditor name="content" defaultValue={page?.content ?? ""} placeholder="Page content…" />
      </FormField>

      <FormField label="Featured Image URL" name="featuredImage">
        <Input name="featuredImage" type="url" defaultValue={page?.featuredImage ?? ""} placeholder="https://..." />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={page?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormField>

      <SeoFields seoTitle={page?.seoTitle} seoDescription={page?.seoDescription} canonicalUrl={page?.canonicalUrl} />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={page ? "Save Changes" : "Create Page"} />
        <a href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
      </div>
    </form>
  );
}
