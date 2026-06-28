"use client";

import { useActionState } from "react";
import { saveTrackingSettings, type TrackingSettingsState } from "@/lib/actions/tracking-settings";

interface Props {
  initialValues: {
    ga4MeasurementId?: string | null;
    googleAdsConversionId?: string | null;
    googleAdsConversionLabel?: string | null;
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

export function TrackingSettingsForm({ initialValues }: Props) {
  const [state, formAction, pending] = useActionState<TrackingSettingsState, FormData>(
    saveTrackingSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          Settings saved successfully. Changes apply to all new page loads.
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {/* GA4 */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Google Analytics 4</h2>
            <p className="text-xs text-slate-500">Tracks page views, events, and user behaviour globally</p>
          </div>
        </div>
        <Field
          label="GA4 Measurement ID"
          name="ga4MeasurementId"
          defaultValue={state?.success ? undefined : initialValues.ga4MeasurementId}
          placeholder="G-XXXXXXXXXX"
          hint="Found in GA4 → Admin → Data Streams → Measurement ID"
        />
      </section>

      {/* Google Ads */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Google Ads Conversion Tracking</h2>
            <p className="text-xs text-slate-500">Fires a conversion when a lead form is submitted</p>
          </div>
        </div>
        <Field
          label="Google Ads Conversion ID"
          name="googleAdsConversionId"
          defaultValue={state?.success ? undefined : initialValues.googleAdsConversionId}
          placeholder="123456789"
          hint="Found in Google Ads → Tools → Conversions → Tag setup (the number after AW-)"
        />
        <Field
          label="Google Ads Conversion Label"
          name="googleAdsConversionLabel"
          defaultValue={state?.success ? undefined : initialValues.googleAdsConversionLabel}
          placeholder="AbCdEfGhIjKlMnOp"
          hint="Found alongside the Conversion ID in the gtag snippet"
        />
      </section>

      {/* Events info */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Events Tracked</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { event: "page_view",          desc: "All pages (automatic)" },
            { event: "lead_submission",    desc: "Lead form submit" },
            { event: "conversion",         desc: "Google Ads (lead submit)" },
            { event: "case_study_view",    desc: "Case study detail pages" },
            { event: "service_page_view",  desc: "Service detail pages" },
            { event: "blog_post_view",     desc: "Blog post pages" },
          ].map(({ event, desc }) => (
            <div key={event} className="flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <div>
                <code className="text-xs font-mono text-slate-700">{event}</code>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
