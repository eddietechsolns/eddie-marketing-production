"use client";

import { useActionState, useState } from "react";
import { saveCaseStudy } from "@/lib/actions/case-studies";
import type { CaseStudy } from "@prisma/client";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/ActionButtons";
import RichTextEditor from "@/components/admin/RichTextEditor";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  caseStudy?: CaseStudy;
}

export default function CaseStudyForm({ caseStudy }: Props) {
  const [state, action, pending] = useActionState(saveCaseStudy, {
    error: null,
  });
  const [slug, setSlug] = useState(caseStudy?.slug ?? "");

  return (
    <form action={action} className="space-y-6">
      {caseStudy && <input type="hidden" name="id" value={caseStudy.id} />}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* ── Basic Info ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Basic Info
        </h3>

        <FormField label="Title" name="title" required>
          <Input
            name="title"
            required
            defaultValue={caseStudy?.title ?? ""}
            onChange={(e) => {
              if (!caseStudy) setSlug(slugify(e.target.value));
            }}
            placeholder="Gulf Medical Centers — 312% Organic Growth"
          />
        </FormField>

        <FormField label="Slug" name="slug" required>
          <Input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="gulf-medical-centers-312-organic-growth"
          />
        </FormField>

        <FormField label="Status" name="status">
          <Select name="status" defaultValue={caseStudy?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </FormField>
      </div>

      {/* ── Client Information ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Client Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Client Name" name="clientName">
            <Input
              name="clientName"
              defaultValue={caseStudy?.clientName ?? ""}
              placeholder="Gulf Medical Centers"
            />
          </FormField>
          <FormField label="Country" name="country">
            <Input
              name="country"
              defaultValue={caseStudy?.country ?? ""}
              placeholder="United Arab Emirates"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Industry" name="industry" hint="Matches Industry page titles">
            <Input
              name="industry"
              defaultValue={caseStudy?.industry ?? ""}
              placeholder="Healthcare"
            />
          </FormField>
          <FormField label="Service Type" name="serviceType" hint="Matches Service Category names">
            <Input
              name="serviceType"
              defaultValue={caseStudy?.serviceType ?? ""}
              placeholder="SEO"
            />
          </FormField>
        </div>
      </div>

      {/* ── Case Study Content ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Case Study Content
        </h3>

        <FormField label="Challenge" name="challenge" hint="What problem did the client face?">
          <RichTextEditor name="challenge" defaultValue={caseStudy?.challenge ?? ""} placeholder="The client was struggling with…" minHeight={180} />
        </FormField>

        <FormField label="Strategy" name="strategy" hint="What approach did we take?">
          <RichTextEditor name="strategy" defaultValue={caseStudy?.strategy ?? ""} placeholder="We developed a strategy that…" minHeight={180} />
        </FormField>

        <FormField label="Implementation" name="implementation" hint="What specific actions were taken?">
          <RichTextEditor name="implementation" defaultValue={caseStudy?.implementation ?? ""} placeholder="Our team executed…" minHeight={180} />
        </FormField>

        <FormField label="Results" name="results" hint="What were the outcomes?">
          <RichTextEditor name="results" defaultValue={caseStudy?.results ?? ""} placeholder="Within 6 months, the client saw…" minHeight={180} />
        </FormField>

        <FormField label="Client Testimonial" name="testimonial" hint="Direct quote from the client">
          <Textarea
            name="testimonial"
            rows={3}
            defaultValue={caseStudy?.testimonial ?? ""}
            placeholder="&quot;Eddie Marketing transformed our online presence...&quot;"
          />
        </FormField>
      </div>

      {/* ── Results Metrics ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Results Metrics
        </h3>
        <p className="text-xs text-gray-500">
          Enter numbers only (e.g. 312 for +312%). Leave blank if not applicable.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Traffic Increase %" name="trafficIncreasePercent">
            <Input
              name="trafficIncreasePercent"
              type="number"
              step="0.1"
              defaultValue={caseStudy?.trafficIncreasePercent?.toString() ?? ""}
              placeholder="312"
            />
          </FormField>
          <FormField label="Lead Increase %" name="leadIncreasePercent">
            <Input
              name="leadIncreasePercent"
              type="number"
              step="0.1"
              defaultValue={caseStudy?.leadIncreasePercent?.toString() ?? ""}
              placeholder="245"
            />
          </FormField>
          <FormField label="Conversion Rate Increase %" name="conversionIncreasePercent">
            <Input
              name="conversionIncreasePercent"
              type="number"
              step="0.1"
              defaultValue={caseStudy?.conversionIncreasePercent?.toString() ?? ""}
              placeholder="180"
            />
          </FormField>
          <FormField label="Revenue Generated" name="revenueGenerated">
            <Input
              name="revenueGenerated"
              defaultValue={caseStudy?.revenueGenerated ?? ""}
              placeholder="AED 250,000"
            />
          </FormField>
        </div>
      </div>

      {/* ── Media ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Media
        </h3>
        <FormField label="Featured Image URL" name="featuredImage">
          <Input
            name="featuredImage"
            type="url"
            defaultValue={caseStudy?.featuredImage ?? ""}
            placeholder="https://..."
          />
        </FormField>
        <FormField
          label="Gallery Image URLs"
          name="galleryImages"
          hint="One URL per line"
        >
          <Textarea
            name="galleryImages"
            rows={3}
            defaultValue={caseStudy?.galleryImages?.join("\n") ?? ""}
            placeholder={"https://...\nhttps://..."}
          />
        </FormField>
      </div>

      {/* ── SEO ────────────────────────────────────────────────────────────── */}
      <SeoFields
        seoTitle={caseStudy?.seoTitle}
        seoDescription={caseStudy?.seoDescription}
        canonicalUrl={caseStudy?.canonicalUrl}
      />

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Open Graph
        </h3>
        <div className="space-y-4">
          <FormField label="OG Title" name="ogTitle" hint="Defaults to SEO title">
            <Input
              name="ogTitle"
              defaultValue={caseStudy?.ogTitle ?? ""}
              placeholder="Custom OG title..."
              maxLength={60}
            />
          </FormField>
          <FormField label="OG Description" name="ogDescription" hint="Defaults to SEO description">
            <Textarea
              name="ogDescription"
              rows={2}
              defaultValue={caseStudy?.ogDescription ?? ""}
              placeholder="Custom OG description..."
              maxLength={155}
            />
          </FormField>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-3">
        <SaveButton
          pending={pending}
          label={caseStudy ? "Save Changes" : "Create Case Study"}
        />
        <a
          href="/admin/case-studies"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
