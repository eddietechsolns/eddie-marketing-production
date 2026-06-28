"use client";

import { useActionState, useState } from "react";
import { saveIndustry } from "@/lib/actions/industries";
import type { Industry } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function IndustryForm({ industry }: { industry?: Industry }) {
  const [state, action, pending] = useActionState(saveIndustry, { error: null });
  const [slug, setSlug] = useState(industry?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {industry && <input type="hidden" name="id" value={industry.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required>
        <Input
          name="title"
          required
          defaultValue={industry?.title ?? ""}
          onChange={(e) => { if (!industry) setSlug(slugify(e.target.value)); }}
          placeholder="Industry title"
        />
      </FormField>

      <FormField label="Slug" name="slug" required>
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="industry-slug"
        />
      </FormField>

      <FormField label="Excerpt" name="excerpt">
        <Textarea name="excerpt" rows={2} defaultValue={industry?.excerpt ?? ""} placeholder="Short description..." />
      </FormField>

      <FormField label="Content" name="content">
        <Textarea name="content" rows={10} defaultValue={industry?.content ?? ""} placeholder="Industry page content..." />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={industry?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormField>

      <SeoFields seoTitle={industry?.seoTitle} seoDescription={industry?.seoDescription} canonicalUrl={industry?.canonicalUrl} />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={industry ? "Save Changes" : "Create Industry"} />
        <a href="/admin/industries" className="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
      </div>
    </form>
  );
}
