"use client";

import { useActionState, useState } from "react";
import { saveLocation } from "@/lib/actions/locations";
import type { Location } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function LocationForm({ location }: { location?: Location }) {
  const [state, action, pending] = useActionState(saveLocation, { error: null });
  const [slug, setSlug] = useState(location?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {location && <input type="hidden" name="id" value={location.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required hint="e.g. Digital Marketing Agency in Chicago">
        <Input
          name="title"
          required
          defaultValue={location?.title ?? ""}
          onChange={(e) => { if (!location) setSlug(slugify(e.target.value)); }}
          placeholder="Location page title"
        />
      </FormField>

      <FormField label="Slug" name="slug" required>
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="chicago"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" name="city">
          <Input name="city" defaultValue={location?.city ?? ""} placeholder="Chicago" />
        </FormField>
        <FormField label="State" name="state">
          <Input name="state" defaultValue={location?.state ?? ""} placeholder="IL" maxLength={2} />
        </FormField>
      </div>

      <FormField label="Excerpt" name="excerpt">
        <Textarea name="excerpt" rows={2} defaultValue={location?.excerpt ?? ""} placeholder="Short description..." />
      </FormField>

      <FormField label="Content" name="content">
        <Textarea name="content" rows={10} defaultValue={location?.content ?? ""} placeholder="Location page content..." />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={location?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormField>

      <SeoFields seoTitle={location?.seoTitle} seoDescription={location?.seoDescription} canonicalUrl={location?.canonicalUrl} />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={location ? "Save Changes" : "Create Location"} />
        <a href="/admin/locations" className="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
      </div>
    </form>
  );
}
