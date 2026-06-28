"use client";

import { useActionState, useState } from "react";
import { savePortfolio } from "@/lib/actions/portfolio";
import type { Industry, Location, PortfolioCategory, PortfolioProject } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Props {
  project?: PortfolioProject & {
    category: PortfolioCategory | null;
    industries: Industry[];
    locations: Location[];
  };
  portfolioCategories: PortfolioCategory[];
  industries: Industry[];
  locations: Location[];
}

export default function PortfolioForm({ project, portfolioCategories, industries, locations }: Props) {
  const [state, action, pending] = useActionState(savePortfolio, { error: null });
  const [slug, setSlug] = useState(project?.slug ?? "");

  const selectedIndustryIds = new Set(project?.industries.map((i) => i.id) ?? []);
  const selectedLocationIds = new Set(project?.locations.map((l) => l.id) ?? []);

  return (
    <form action={action} className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="Title" name="title" required>
        <Input
          name="title"
          required
          defaultValue={project?.title ?? ""}
          onChange={(e) => { if (!project) setSlug(slugify(e.target.value)); }}
          placeholder="Project title"
        />
      </FormField>

      <FormField label="Slug" name="slug" required>
        <Input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="project-slug"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Client" name="client">
          <Input name="client" defaultValue={project?.client ?? ""} placeholder="Client name" />
        </FormField>
        <FormField label="Category" name="categoryId">
          <Select name="categoryId" defaultValue={project?.categoryId?.toString() ?? ""}>
            <option value="">No category</option>
            {portfolioCategories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {industries.length > 0 && (
        <FormField label="Industries" name="industryId" hint="Select all that apply">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {industries.map((ind) => (
              <label key={ind.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="industryId"
                  value={ind.id}
                  defaultChecked={selectedIndustryIds.has(ind.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {ind.title}
              </label>
            ))}
          </div>
        </FormField>
      )}

      {locations.length > 0 && (
        <FormField label="Locations" name="locationId" hint="Select all that apply">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {locations.map((loc) => (
              <label key={loc.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="locationId"
                  value={loc.id}
                  defaultChecked={selectedLocationIds.has(loc.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {loc.title}
              </label>
            ))}
          </div>
        </FormField>
      )}

      <FormField label="Services" name="services" hint="Comma-separated tags, e.g. SEO, Google Ads">
        <Input
          name="services"
          defaultValue={project?.services?.join(", ") ?? ""}
          placeholder="SEO, Google Ads, Local SEO"
        />
      </FormField>

      <FormField label="Excerpt" name="excerpt">
        <Textarea
          name="excerpt"
          rows={2}
          defaultValue={project?.excerpt ?? ""}
          placeholder="Short result summary..."
        />
      </FormField>

      <FormField label="Content" name="content">
        <Textarea
          name="content"
          rows={10}
          defaultValue={project?.content ?? ""}
          placeholder="Full case study..."
        />
      </FormField>

      <FormField label="Status" name="status">
        <Select name="status" defaultValue={project?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormField>

      <SeoFields
        seoTitle={project?.seoTitle}
        seoDescription={project?.seoDescription}
        canonicalUrl={project?.canonicalUrl}
      />

      <div className="pt-4 flex items-center gap-3">
        <SaveButton pending={pending} label={project ? "Save Changes" : "Create Project"} />
        <a href="/admin/portfolio" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  );
}
