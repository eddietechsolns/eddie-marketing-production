"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitApplication,
  type SubmitApplicationState,
  LEAD_SOURCE,
} from "@/actions/submitApplication";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SuccessView({ leadId, roleApplied }: { leadId?: number; roleApplied?: string }) {
  return (
    <div className="py-8 space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Application received!</h3>
          {leadId && (
            <p className="text-xs text-slate-400 mt-0.5">Ref #{leadId.toString().padStart(4, "0")}</p>
          )}
        </div>
        <p className="text-sm text-slate-600 max-w-xs">
          {roleApplied
            ? `Thank you for applying for the ${roleApplied} role.`
            : "Thank you for your application."}{" "}
          Our team will review it and be in touch within 3–5 business days.
        </p>
      </div>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">What happens next</p>
        <ol className="space-y-3">
          {[
            { n: "1", label: "Application review", detail: "Our HR team reviews your application within 3–5 business days." },
            { n: "2", label: "Initial call", detail: "Shortlisted candidates receive a 20-minute call with our team." },
            { n: "3", label: "Interview & offer", detail: "Successful candidates progress to a structured interview and offer." },
          ].map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

interface Props {
  jobTitle: string;
  department: string;
}

export function JobApplicationForm({ jobTitle, department }: Props) {
  const [state, formAction, pending] = useActionState<SubmitApplicationState, FormData>(
    submitApplication,
    null
  );

  const landingPageRef  = useRef<HTMLInputElement>(null);
  const referrerRef     = useRef<HTMLInputElement>(null);
  const utmSourceRef    = useRef<HTMLInputElement>(null);
  const utmMediumRef    = useRef<HTMLInputElement>(null);
  const utmCampaignRef  = useRef<HTMLInputElement>(null);
  const utmContentRef   = useRef<HTMLInputElement>(null);
  const utmTermRef      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (landingPageRef.current)  landingPageRef.current.value  = window.location.href;
    if (referrerRef.current)     referrerRef.current.value     = document.referrer;
    const p = new URLSearchParams(window.location.search);
    if (utmSourceRef.current)    utmSourceRef.current.value    = p.get("utm_source")   ?? "";
    if (utmMediumRef.current)    utmMediumRef.current.value    = p.get("utm_medium")   ?? "";
    if (utmCampaignRef.current)  utmCampaignRef.current.value  = p.get("utm_campaign") ?? "";
    if (utmContentRef.current)   utmContentRef.current.value   = p.get("utm_content")  ?? "";
    if (utmTermRef.current)      utmTermRef.current.value      = p.get("utm_term")     ?? "";
  }, []);

  if (state?.success) {
    return <SuccessView leadId={state.leadId} roleApplied={state.roleApplied} />;
  }

  const inputBase = "w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors border-slate-300";

  return (
    <form
      action={formAction}
      noValidate
      className={`space-y-4 transition-opacity duration-200 ${pending ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Hidden attribution + metadata */}
      <input ref={landingPageRef}  type="hidden" name="landingPage" />
      <input ref={referrerRef}     type="hidden" name="referrer" />
      <input ref={utmSourceRef}    type="hidden" name="utmSource" />
      <input ref={utmMediumRef}    type="hidden" name="utmMedium" />
      <input ref={utmCampaignRef}  type="hidden" name="utmCampaign" />
      <input ref={utmContentRef}   type="hidden" name="utmContent" />
      <input ref={utmTermRef}      type="hidden" name="utmTerm" />
      <input type="hidden" name="leadSource"  value={LEAD_SOURCE.JOB_APPLICATION} />
      <input type="hidden" name="roleApplied" value={jobTitle} />
      <input type="hidden" name="department"  value={department} />

      {state?.error && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {state.error}
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input id="ja-name" name="name" type="text" autoComplete="name" placeholder="Your full name" className={inputBase} required />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input id="ja-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputBase} required />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      {/* Phone + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-phone">
            Phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ja-phone" name="phone" type="tel" autoComplete="tel" placeholder="+971 50 000 0000" className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-country">
            Country <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ja-country" name="country" type="text" autoComplete="country-name" placeholder="e.g. UAE, India, UK" className={inputBase} />
        </div>
      </div>

      {/* Current Position + LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-position">
            Current Role / Title <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ja-position" name="currentPosition" type="text" placeholder="e.g. SEO Executive at XYZ Agency" className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-linkedin">
            LinkedIn Profile <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ja-linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourname" className={inputBase} />
        </div>
      </div>

      {/* Portfolio URL */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-portfolio">
          Portfolio / Work Samples <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input id="ja-portfolio" name="portfolio" type="url" placeholder="https://yourportfolio.com or Google Drive link" className={inputBase} />
      </div>

      {/* CV placeholder */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          CV / Résumé <span className="text-slate-400 font-normal">(attach link below or in the cover letter)</span>
        </label>
        <div className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg px-4 py-3 bg-slate-50">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-slate-500 leading-relaxed">
            Share a Google Drive or Dropbox link to your CV in the message field. We will request your CV directly once shortlisted.
          </p>
        </div>
      </div>

      {/* Cover letter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ja-message">
          Cover Letter <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="ja-message"
          name="message"
          rows={4}
          placeholder={`Why are you a great fit for the ${jobTitle} role? Include a CV link if you have one.`}
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 ems-btn-gradient disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg text-sm"
      >
        {pending ? <><Spinner /> Submitting…</> : "Submit Application"}
      </button>

      <p className="text-xs text-slate-400 text-center leading-relaxed">
        We respond within 3–5 business days. No spam, ever.{" "}
        <a href="/privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</a>.
      </p>
    </form>
  );
}
