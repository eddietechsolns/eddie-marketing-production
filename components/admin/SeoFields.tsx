import { FormField, Input, Textarea } from "./FormField";

interface SeoFieldsProps {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

export default function SeoFields({ seoTitle, seoDescription, canonicalUrl }: SeoFieldsProps) {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        SEO
      </h3>
      <div className="space-y-4">
        <FormField label="SEO Title" name="seoTitle" hint="Defaults to page title if empty">
          <Input
            name="seoTitle"
            defaultValue={seoTitle ?? ""}
            placeholder="Custom SEO title..."
            maxLength={60}
          />
        </FormField>
        <FormField label="SEO Description" name="seoDescription" hint="155 characters max">
          <Textarea
            name="seoDescription"
            defaultValue={seoDescription ?? ""}
            rows={2}
            placeholder="Meta description..."
            maxLength={155}
          />
        </FormField>
        <FormField label="Canonical URL" name="canonicalUrl" hint="Leave blank to use current URL">
          <Input
            name="canonicalUrl"
            type="url"
            defaultValue={canonicalUrl ?? ""}
            placeholder="https://..."
          />
        </FormField>
      </div>
    </div>
  );
}
