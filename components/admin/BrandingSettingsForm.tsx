"use client";

import { useActionState } from "react";
import { saveBrandingSettings, type BrandingSettingsState } from "@/lib/actions/branding-settings";

interface Props {
  initialValues: {
    headerLogoUrl?: string | null;
    footerLogoUrl?: string | null;
    faviconUrl?: string | null;
  };
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-mono"
      />
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function BrandingSettingsForm({ initialValues }: Props) {
  const [state, formAction, pending] = useActionState<BrandingSettingsState, FormData>(
    saveBrandingSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          Branding settings saved. Changes apply on next page load.
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Logo URLs</h2>
            <p className="text-xs text-slate-500">Upload logos to /public/brand/ and enter the path here. Leave blank to use the default SVG logos.</p>
          </div>
        </div>

        <Field
          label="Header Logo URL"
          name="headerLogoUrl"
          defaultValue={state?.success ? undefined : initialValues.headerLogoUrl}
          placeholder="/brand/ems-logo.svg"
          hint="Displayed in the site header on a white background. Recommended: SVG or PNG, width ≈ 210px."
        />
        <Field
          label="Footer Logo URL"
          name="footerLogoUrl"
          defaultValue={state?.success ? undefined : initialValues.footerLogoUrl}
          placeholder="/brand/ems-logo-white.svg"
          hint="Displayed in the footer on a dark (slate-900) background. Use a white/light version."
        />
        <Field
          label="Favicon URL"
          name="faviconUrl"
          defaultValue={state?.success ? undefined : initialValues.faviconUrl}
          placeholder="/favicon.ico"
          hint="Browser tab icon. Must be .ico, .png, or .svg. Recommended: 32×32 or 64×64 px."
        />
      </section>

      <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Current Logos</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-slate-500">Header (light background)</p>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <img src={initialValues.headerLogoUrl ?? "/brand/ems-logo.svg"} alt="Header logo" className="h-8 w-auto" />
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-slate-500">Footer (dark background)</p>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <img src={initialValues.footerLogoUrl ?? "/brand/ems-logo-white.svg"} alt="Footer logo" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        {pending ? "Saving…" : "Save Branding"}
      </button>
    </form>
  );
}
