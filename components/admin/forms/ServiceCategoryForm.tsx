"use client";

import { useActionState, useState } from "react";
import { saveServiceCategory } from "@/lib/actions/service-categories";
import type { ServiceCategory } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ServiceCategoryForm({ category }: { category?: ServiceCategory }) {
  const [state, action, pending] = useActionState(saveServiceCategory, { error: null });
  const [slug, setSlug] = useState(category?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {category && <input type="hidden" name="id" value={category.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Name" name="name" required>
        <Input
          name="name"
          required
          defaultValue={category?.name ?? ""}
          onChange={(e) => { if (!category) setSlug(slugify(e.target.value)); }}
          placeholder="e.g. SEO"
        />
      </FormField>

      <FormField label="Slug" name="slug" required hint="URL-friendly identifier used in service routes">
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. seo"
        />
      </FormField>

      <FormField label="Description" name="description">
        <Textarea
          name="description"
          rows={2}
          defaultValue={category?.description ?? ""}
          placeholder="Optional description shown on the services page…"
        />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={category?.status ?? "published"}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
      </FormField>

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={category ? "Save Changes" : "Create Category"} />
        <a href="/admin/service-categories" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  );
}
