"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitApplication,
  type SubmitApplicationState,
  LEAD_SOURCE,
} from "@/actions/submitApplication";

const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() + i - 1));

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SuccessView({ leadId }: { leadId?: number }) {
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
          Thank you for your interest in joining Eddie Marketing Solutions. Our team will review your application and contact you within 3–5 business days.
        </p>
      </div>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">What happens next</p>
        <ol className="space-y-3">
          {[
            { n: "1", label: "Application review", detail: "Our HR team reviews your application within 3–5 business days." },
            { n: "2", label: "Initial call", detail: "If shortlisted, we schedule a 20-minute discovery call." },
            { n: "3", label: "Offer & onboarding", detail: "Successful candidates receive an internship offer and onboarding details." },
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
  positionTitle: string;
}

export function InternshipApplicationForm({ positionTitle }: Props) {
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

  if (state?.success) return <SuccessView leadId={state.leadId} />;

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
      <input type="hidden" name="leadSource"  value={LEAD_SOURCE.INTERNSHIP_APPLICATION} />
      <input type="hidden" name="roleApplied" value={positionTitle} />
      <input type="hidden" name="department"  value="Internships" />

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
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input id="ia-name" name="name" type="text" autoComplete="name" placeholder="Your full name" className={inputBase} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input id="ia-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputBase} required />
        </div>
      </div>

      {/* Phone + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-phone">
            Phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ia-phone" name="phone" type="tel" autoComplete="tel" placeholder="+971 50 000 0000" className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-country">
            Country <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ia-country" name="country" type="text" autoComplete="country-name" placeholder="e.g. UAE, India, UK" className={inputBase} />
        </div>
      </div>

      {/* University + Current Course */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-university">
            University / Institution <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ia-university" name="university" type="text" placeholder="e.g. University of Dubai" className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-course">
            Current Course / Degree <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ia-course" name="currentPosition" type="text" placeholder="e.g. BSc Marketing" className={inputBase} />
        </div>
      </div>

      {/* Graduation Year + LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-grad-year">
            Expected Graduation Year <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            id="ia-grad-year"
            name="graduationYear"
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          >
            <option value="">Select year…</option>
            {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-linkedin">
            LinkedIn Profile <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input id="ia-linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourname" className={inputBase} />
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-portfolio">
          Portfolio URL <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input id="ia-portfolio" name="portfolio" type="url" placeholder="https://yourportfolio.com" className={inputBase} />
      </div>

      {/* CV placeholder */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          CV / Résumé <span className="text-slate-400 font-normal">(attach link or mention below)</span>
        </label>
        <div className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg px-4 py-3 bg-slate-50">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-slate-500 leading-relaxed">
            Share a Google Drive or Dropbox link to your CV in the message field below.
          </p>
        </div>
      </div>

      {/* Cover Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="ia-message">
          Cover Message <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="ia-message"
          name="message"
          rows={4}
          placeholder={`Tell us why you're interested in the ${positionTitle} position and what you bring to the role…`}
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
