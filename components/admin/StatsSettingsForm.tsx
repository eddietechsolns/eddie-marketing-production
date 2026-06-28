"use client";

import { useActionState } from "react";
import { saveStatsSettings, type StatsSettingsState } from "@/lib/actions/stats-settings";

interface Props {
  initialValues: {
    clientsServed?: string | null;
    retentionRate?: string | null;
    revenueGenerated?: string | null;
    yearsExperience?: string | null;
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
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
      />
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function StatsSettingsForm({ initialValues }: Props) {
  const [state, formAction, pending] = useActionState<StatsSettingsState, FormData>(
    saveStatsSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          Stats saved. Homepage updates on next page load.
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Homepage Statistics</h2>
            <p className="text-xs text-slate-500">Displayed in the hero section and the Stats section. Leave blank to use the built-in defaults.</p>
          </div>
        </div>

        <Field
          label="Clients Served"
          name="clientsServed"
          defaultValue={state?.success ? undefined : initialValues.clientsServed}
          placeholder="500+"
          hint='Shown as "X Clients Served". Include the + or suffix in the value.'
        />
        <Field
          label="Client Retention Rate"
          name="retentionRate"
          defaultValue={state?.success ? undefined : initialValues.retentionRate}
          placeholder="98%"
          hint='Shown as "X% Client Retention". Include the % symbol.'
        />
        <Field
          label="Revenue Generated"
          name="revenueGenerated"
          defaultValue={state?.success ? undefined : initialValues.revenueGenerated}
          placeholder="$50M+"
          hint='Shown as "X Revenue Generated". Include the currency symbol and suffix.'
        />
        <Field
          label="Years Experience"
          name="yearsExperience"
          defaultValue={state?.success ? undefined : initialValues.yearsExperience}
          placeholder="15+"
          hint='Shown as "X Years Experience". Include the + if desired.'
        />
      </section>

      <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Preview</h3>
        <p className="text-xs text-slate-400">These values appear in the hero strip and the &ldquo;Numbers Don&apos;t Lie&rdquo; section on the homepage.</p>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        {pending ? "Saving…" : "Save Stats"}
      </button>
    </form>
  );
}
