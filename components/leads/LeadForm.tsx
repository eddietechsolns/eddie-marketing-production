"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type SubmitLeadState } from "@/actions/submitLead";
import { trackLeadConversion } from "@/lib/analytics";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service…" },
  { value: "SEO", label: "SEO" },
  { value: "Google Ads", label: "Google Ads" },
  { value: "Social Media Marketing", label: "Social Media Marketing" },
  { value: "Web Design & Development", label: "Web Design & Development" },
  { value: "Content Marketing", label: "Content Marketing" },
  { value: "Email Marketing", label: "Email Marketing" },
  { value: "Local SEO", label: "Local SEO" },
  { value: "Analytics & Reporting", label: "Analytics & Reporting" },
  { value: "Other", label: "Other" },
];

const NEXT_STEPS = [
  {
    n: "1",
    label: "Strategy review",
    detail: "We review your request and research your market — typically within 2 hours.",
  },
  {
    n: "2",
    label: "Consultation call",
    detail: "A senior strategist contacts you to schedule a brief discovery call.",
  },
  {
    n: "3",
    label: "Custom plan",
    detail: "You receive a tailored marketing strategy within 2 business days.",
  },
];

interface Props {
  defaultService?: string;
  submitLabel?: string;
}

function clientValidate(name: string, value: string): string {
  if (name === "name") {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Please enter at least 2 characters";
  }
  if (name === "email") {
    if (!value.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Please enter a valid email address";
  }
  return "";
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SuccessView({ leadId }: { leadId?: number }) {
  return (
    <div className="py-6 space-y-6">
      {/* Check icon */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Request received!</h3>
          {leadId && (
            <p className="text-xs text-slate-400 mt-0.5">
              Ref #{leadId.toString().padStart(4, "0")}
            </p>
          )}
        </div>
        <p className="text-sm text-slate-600 max-w-xs">
          Thank you — we&apos;ll have a response for you within one business day.
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
          What happens next
        </p>
        <ol className="space-y-4">
          {NEXT_STEPS.map((step) => (
            <li key={step.n} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-center text-slate-400">
        Questions?{" "}
        <a
          href="mailto:info@eddietechsolns.com"
          className="text-blue-600 hover:underline"
        >
          info@eddietechsolns.com
        </a>
      </p>
    </div>
  );
}

export function LeadForm({ defaultService = "", submitLabel = "Send Message" }: Props) {
  const [state, formAction, pending] = useActionState<SubmitLeadState, FormData>(
    submitLead,
    null
  );
  const hasTracked = useRef(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const landingPageRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const utmSourceRef = useRef<HTMLInputElement>(null);
  const utmMediumRef = useRef<HTMLInputElement>(null);
  const utmCampaignRef = useRef<HTMLInputElement>(null);
  const utmContentRef = useRef<HTMLInputElement>(null);
  const utmTermRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success && !hasTracked.current) {
      hasTracked.current = true;
      const p = new URLSearchParams(window.location.search);
      trackLeadConversion({
        serviceInterest: state.serviceInterest,
        leadId: state.leadId,
        landingPage: window.location.href,
        utmCampaign: state.utmCampaign ?? p.get("utm_campaign") ?? undefined,
        utmSource: state.utmSource ?? p.get("utm_source") ?? undefined,
      });
    }
  }, [state?.success]);

  useEffect(() => {
    if (landingPageRef.current) landingPageRef.current.value = window.location.href;
    if (referrerRef.current) referrerRef.current.value = document.referrer;
    const p = new URLSearchParams(window.location.search);
    if (utmSourceRef.current) utmSourceRef.current.value = p.get("utm_source") ?? "";
    if (utmMediumRef.current) utmMediumRef.current.value = p.get("utm_medium") ?? "";
    if (utmCampaignRef.current) utmCampaignRef.current.value = p.get("utm_campaign") ?? "";
    if (utmContentRef.current) utmContentRef.current.value = p.get("utm_content") ?? "";
    if (utmTermRef.current) utmTermRef.current.value = p.get("utm_term") ?? "";
  }, []);

  if (state?.success) {
    return <SuccessView leadId={state.leadId} />;
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const err = clientValidate(name, value);
    setClientErrors((c) => ({ ...c, [name]: err }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (touched[name]) {
      const err = clientValidate(name, value);
      setClientErrors((c) => ({ ...c, [name]: err }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const nameVal = nameRef.current?.value ?? "";
    const emailVal = emailRef.current?.value ?? "";

    const nameErr = clientValidate("name", nameVal);
    const emailErr = clientValidate("email", emailVal);

    if (nameErr || emailErr) {
      e.preventDefault();
      const errors: Record<string, string> = {};
      if (nameErr) errors.name = nameErr;
      if (emailErr) errors.email = emailErr;
      setClientErrors(errors);
      setTouched({ name: true, email: true });
      if (nameErr) {
        nameRef.current?.focus();
      } else {
        emailRef.current?.focus();
      }
      return;
    }

    setClientErrors({});
    void form;
  }

  function fieldError(field: string): string | undefined {
    return clientErrors[field] || state?.fieldErrors?.[field]?.[0];
  }

  const inputBase =
    "w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors";
  const inputNormal = `${inputBase} border-slate-300 focus:ring-blue-100 focus:border-blue-500`;
  const inputError = `${inputBase} border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400`;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 transition-opacity duration-200 ${pending ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Attribution hidden inputs */}
      <input ref={landingPageRef} type="hidden" name="landingPage" />
      <input ref={referrerRef} type="hidden" name="referrer" />
      <input ref={utmSourceRef} type="hidden" name="utmSource" />
      <input ref={utmMediumRef} type="hidden" name="utmMedium" />
      <input ref={utmCampaignRef} type="hidden" name="utmCampaign" />
      <input ref={utmContentRef} type="hidden" name="utmContent" />
      <input ref={utmTermRef} type="hidden" name="utmTerm" />

      {state?.error && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {state.error}
        </div>
      )}

      {/* Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={nameRef}
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Mohammed Al Rashid"
            className={fieldError("name") ? inputError : inputNormal}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldError("name")}
            aria-describedby={fieldError("name") ? "error-name" : undefined}
          />
          {fieldError("name") && (
            <p id="error-name" className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fieldError("name")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-company">
            Company <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="lead-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Your company name"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-email">
            Work Email <span className="text-red-500">*</span>
          </label>
          <input
            ref={emailRef}
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldError("email") ? inputError : inputNormal}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldError("email")}
            aria-describedby={fieldError("email") ? "error-email" : undefined}
          />
          {fieldError("email") && (
            <p id="error-email" className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fieldError("email")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-phone">
            Phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971 50 000 0000"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Country + Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-country">
            Country <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="lead-country"
            name="country"
            type="text"
            autoComplete="country-name"
            placeholder="e.g. Dubai, UAE"
            className={inputNormal}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-service">
            Service Interest <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            id="lead-service"
            name="serviceInterest"
            defaultValue={defaultService}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="lead-message">
          Message <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={3}
          placeholder="Tell us about your business and what you're looking to achieve…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none transition-colors"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 ems-btn-gradient disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg text-sm"
      >
        {pending ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          submitLabel
        )}
      </button>

      <p className="text-xs text-slate-400 text-center leading-relaxed">
        No spam, ever. We respond within one business day.
        <br />
        By submitting, you agree to our{" "}
        <a href="/privacy" className="underline hover:text-slate-600 transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
