"use client";

import { useActionState, useState } from "react";
import { saveService } from "@/lib/actions/services";
import type { Service, ServiceCategory } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Props {
  service?: Service & { category: ServiceCategory | null };
  serviceCategories: ServiceCategory[];
}

export default function ServiceForm({ service, serviceCategories }: Props) {
  const [state, action, pending] = useActionState(saveService, { error: null });
  const [slug, setSlug] = useState(service?.slug ?? "");

  return (
    <form action={action} className="space-y-5">
      {service && <input type="hidden" name="id" value={service.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required>
        <Input
          name="title"
          required
          defaultValue={service?.title ?? ""}
          onChange={(e) => { if (!service) setSlug(slugify(e.target.value)); }}
          placeholder="Service title"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category" name="categoryId">
          <Select
            name="categoryId"
            defaultValue={service?.categoryId?.toString() ?? ""}
          >
            <option value="">No category</option>
            {serviceCategories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Slug" name="slug" required hint="Globally unique URL identifier">
          <Input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="service-slug"
          />
        </FormField>
      </div>

      <FormField label="Excerpt" name="excerpt">
        <Textarea
          name="excerpt"
          rows={2}
          defaultValue={service?.excerpt ?? ""}
          placeholder="Short description..."
        />
      </FormField>

      <FormField label="Content" name="content">
        <Textarea
          name="content"
          rows={10}
          defaultValue={service?.content ?? ""}
          placeholder="Service content..."
        />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={service?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormField>

      <SeoFields
        seoTitle={service?.seoTitle}
        seoDescription={service?.seoDescription}
        canonicalUrl={service?.canonicalUrl}
      />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={service ? "Save Changes" : "Create Service"} />
        <a href="/admin/services" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  );
}
