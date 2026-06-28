"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

// ── Types ────────────────────────────────────────────────────────────────────

interface Recommendation {
  type:
    | "service" | "service-category" | "industry" | "location"
    | "case-study" | "portfolio" | "blog" | "tool" | "academy" | "page";
  title: string;
  path: string;
  cta: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
}

type PanelState = "chat" | "lead-form" | "escalation";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi, I'm Eddie AI Assistant. I can help you choose the right digital marketing service, estimate your needs, or connect you with our team.",
};

const QUICK_ACTIONS = [
  { label: "I need SEO help", value: "I need help with SEO for my business." },
  { label: "I need Google Ads", value: "I need help with Google Ads / PPC campaigns." },
  { label: "I need a website", value: "I need a new website or landing page designed." },
  { label: "I need social media", value: "I need social media marketing management." },
  { label: "I want a proposal", value: "I want to get a marketing proposal for my business." },
  { label: "Speak on WhatsApp", value: "I want to speak with someone on WhatsApp." },
];

// ── Utility ──────────────────────────────────────────────────────────────────

function getOrCreate(key: string, gen: () => string): string {
  if (typeof sessionStorage === "undefined") return gen();
  let v = sessionStorage.getItem(key);
  if (!v) { v = gen(); sessionStorage.setItem(key, v); }
  return v;
}

function uuid(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function buildWhatsappLink(service?: string): string {
  const msg = encodeURIComponent(
    `Hi Eddie Marketing Solutions, I was chatting with your AI assistant and I need help with ${service ?? "digital marketing"}.`
  );
  const num = WHATSAPP.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${msg}`;
}

// ── Main widget ──────────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [panelState, setPanelState] = useState<PanelState>("chat");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [detectedService, setDetectedService] = useState("");
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: "", email: "", phone: "", company: "", serviceInterest: "", message: "",
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialise visitor + session IDs client-side
  useEffect(() => {
    setVisitorId(getOrCreate("eddie_vid", uuid));
    const sid = sessionStorage.getItem("eddie_chat_sid");
    if (sid) setSessionId(sid);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, panelState]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && panelState === "chat") {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, panelState]);

  // ── Open / close ───────────────────────────────────────────────────────────

  function handleOpen() {
    setOpen(true);
    trackEvent("chat_opened");
  }

  function handleClose() {
    setOpen(false);
  }

  // ── Send message ───────────────────────────────────────────────────────────

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    trackEvent("chat_message_sent", { message_preview: trimmed.slice(0, 50) });

    try {
      const utms = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );

      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorId,
          message: trimmed,
          landingPage: typeof window !== "undefined" ? window.location.pathname : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: utms.get("utm_source") ?? "",
          utmMedium: utms.get("utm_medium") ?? "",
          utmCampaign: utms.get("utm_campaign") ?? "",
        }),
      });

      const data = (await res.json()) as {
        sessionId?: string;
        message?: string;
        trigger?: "lead_capture" | "escalate";
        recommendations?: Recommendation[];
        error?: string;
      };

      if (data.sessionId) {
        setSessionId(data.sessionId);
        sessionStorage.setItem("eddie_chat_sid", data.sessionId);
      }

      const reply = data.message ?? "Sorry, I had trouble responding. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          recommendations: data.recommendations,
        },
      ]);

      if (data.trigger === "lead_capture") {
        trackEvent("chat_lead_started");
        const serviceMatch = trimmed.match(/seo|google ads|social media|website|content|email|analytics/i);
        if (serviceMatch) {
          setDetectedService(serviceMatch[0]);
          setLeadForm((f) => ({ ...f, serviceInterest: serviceMatch[0] }));
        }
        setPanelState("lead-form");
      } else if (data.trigger === "escalate") {
        setPanelState("escalation");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try WhatsApp or email us directly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(value: string) {
    if (!open) { handleOpen(); }
    sendMessage(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // ── Lead form ──────────────────────────────────────────────────────────────

  function handleLeadChange(field: keyof LeadFormData, value: string) {
    setLeadForm((f) => ({ ...f, [field]: value }));
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId) return;
    setLeadError("");

    try {
      const res = await fetch("/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...leadForm }),
      });

      if (!res.ok) throw new Error("submit failed");

      setLeadSubmitted(true);
      trackEvent("chat_lead_submitted", { service: leadForm.serviceInterest });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Thanks, ${leadForm.name}! Our team has your details and will be in touch within 2 hours. For anything urgent, WhatsApp us directly.`,
        },
      ]);
      setPanelState("chat");
    } catch {
      setLeadError("Something went wrong. Please try again or contact us directly.");
    }
  }

  // ── WhatsApp / proposal escalation ─────────────────────────────────────────

  function handleWhatsapp() {
    trackEvent("chat_whatsapp_clicked", { service: detectedService });
    window.open(buildWhatsappLink(detectedService), "_blank");
  }

  function handleProposal() {
    trackEvent("chat_proposal_clicked", { service: detectedService });
    setPanelState("lead-form");
  }

  // ── Bubble ─────────────────────────────────────────────────────────────────

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Open chat with Eddie AI Assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full ems-btn-gradient text-white shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        <ChatBubbleIcon />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
          AI
        </span>
      </button>
    );
  }

  // ── Panel ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl bg-white border border-slate-200 overflow-hidden"
      style={{ width: "min(380px, calc(100vw - 24px))", maxHeight: "min(600px, calc(100svh - 100px))" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 ems-gradient-bg px-4 py-3 text-white shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <SparklesIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">Eddie AI Assistant</p>
          <p className="text-[11px] text-white/75 leading-tight">Digital Marketing Expert</p>
        </div>
        <div className="flex items-center gap-1">
          {panelState !== "chat" && (
            <button
              onClick={() => setPanelState("chat")}
              className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
              aria-label="Back to chat"
            >
              <BackIcon />
            </button>
          )}
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Chat panel ── */}
        {panelState === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="space-y-2">
                  {/* Message bubble */}
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ems-gradient-bg text-white text-[10px] font-bold">
                        E
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "ems-gradient-bg text-white rounded-tr-sm"
                          : "bg-slate-100 text-slate-800 rounded-tl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {/* Contextual recommendations */}
                  {m.role === "assistant" &&
                    m.recommendations &&
                    m.recommendations.length > 0 && (
                      <div className="pl-8 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-0.5">
                          Explore related
                        </p>
                        {m.recommendations.map((rec, ri) => (
                          <a
                            key={ri}
                            href={rec.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent("chat_recommendation_clicked", {
                                type: rec.type,
                                path: rec.path,
                              })
                            }
                            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                          >
                            <RecTypeBadge type={rec.type} />
                            <span className="flex-1 min-w-0">
                              <span className="truncate font-medium block leading-tight">
                                {rec.title}
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover:text-teal-600 transition-colors">
                                {rec.cta}
                              </span>
                            </span>
                            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-teal-500 transition-colors">
                              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ems-gradient-bg text-white text-[10px] font-bold">
                    E
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="ems-dot" />
                      <span className="ems-dot" />
                      <span className="ems-dot" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick actions — only show after welcome message, before user sends anything */}
              {messages.length === 1 && !loading && (
                <div className="pt-1 space-y-2">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide px-1">Quick questions</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => handleQuickAction(qa.value)}
                        className="rounded-full border border-blue-200 bg-blue-50/60 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-100/80 hover:border-teal-300 transition-colors font-medium"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 px-3 py-3 shrink-0">
              {/* Escalation shortcuts (shown after first exchange) */}
              {messages.length >= 3 && !leadSubmitted && (
                <div className="flex gap-2 mb-2">
                  {WHATSAPP && (
                    <button
                      onClick={handleWhatsapp}
                      className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-green-600 transition-colors"
                    >
                      <WhatsappIcon />
                      WhatsApp
                    </button>
                  )}
                  <button
                    onClick={() => { trackEvent("chat_lead_started"); setPanelState("lead-form"); }}
                    className="flex items-center gap-1.5 rounded-full ems-gradient-bg px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110 transition-all"
                  >
                    Get a Proposal
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question…"
                  rows={1}
                  disabled={loading}
                  className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-400 disabled:opacity-50"
                  style={{ maxHeight: 80 }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl ems-gradient-bg text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <SendIcon />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-slate-400">
                Eddie AI · eddietechsolns.com
              </p>
            </div>
          </div>
        )}

        {/* ── Lead form panel ── */}
        {panelState === "lead-form" && (
          <form onSubmit={handleLeadSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <div className="rounded-xl px-4 py-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(37,99,235,0.08) 100%)", border: "1px solid rgba(37,99,235,0.15)" }}>
                <p className="text-sm font-semibold text-slate-800">Get your free strategy session</p>
                <p className="text-xs text-slate-600 mt-0.5">Our team will review your needs and respond within 2 hours.</p>
              </div>

              {[
                { label: "Your Name *", field: "name" as const, type: "text", placeholder: "Ahmed Al Rashidi" },
                { label: "Email *", field: "email" as const, type: "email", placeholder: "ahmed@company.ae" },
                { label: "Phone / WhatsApp", field: "phone" as const, type: "tel", placeholder: "+971 50 123 4567" },
                { label: "Company", field: "company" as const, type: "text", placeholder: "Your Company" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                  <input
                    type={type}
                    value={leadForm[field]}
                    onChange={(e) => handleLeadChange(field, e.target.value)}
                    placeholder={placeholder}
                    required={label.includes("*")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Service interest</label>
                <select
                  value={leadForm.serviceInterest}
                  onChange={(e) => handleLeadChange("serviceInterest", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="">Select a service</option>
                  {["SEO", "Google Ads / PPC", "Social Media Marketing", "Web Design", "Content Marketing", "Email Marketing", "Local SEO", "Analytics & Reporting", "Full-Service Package"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Anything else to share?</label>
                <textarea
                  value={leadForm.message}
                  onChange={(e) => handleLeadChange("message", e.target.value)}
                  placeholder="Tell us about your goals or current challenges…"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>

              {leadError && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{leadError}</p>
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3 shrink-0">
              <button
                type="submit"
                className="w-full rounded-xl ems-btn-gradient py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send My Details
              </button>
              <p className="mt-1.5 text-center text-[10px] text-slate-400">
                No spam. We respond within 2 hours.
              </p>
            </div>
          </form>
        )}

        {/* ── Escalation panel ── */}
        {panelState === "escalation" && (
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full ems-gradient-bg">
              <SparklesIcon className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Connect with our team</p>
              <p className="text-sm text-slate-500 mt-1">Choose how you'd like to reach us.</p>
            </div>
            <div className="w-full space-y-3">
              {WHATSAPP && (
                <button
                  onClick={handleWhatsapp}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  <WhatsappIcon className="h-5 w-5" />
                  Continue on WhatsApp
                </button>
              )}
              <button
                onClick={handleProposal}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl ems-gradient-bg py-3 text-sm font-semibold text-white hover:brightness-110 transition-all"
              >
                Request a Proposal
              </button>
              {PHONE && (
                <a
                  href={`tel:${PHONE}`}
                  onClick={() => trackEvent("chat_call_clicked")}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <PhoneIcon />
                  Call Us: {PHONE}
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Icons (inline SVG — no extra package) ────────────────────────────────────

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
    </svg>
  );
}

function SparklesIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function WhatsappIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

// ── Recommendation type badge ─────────────────────────────────────────────────

const REC_BADGE: Record<
  Recommendation["type"],
  { label: string; bg: string; text: string }
> = {
  "service":          { label: "Service",  bg: "bg-teal-50",    text: "text-teal-700"   },
  "service-category": { label: "Services", bg: "bg-teal-50",    text: "text-teal-700"   },
  "case-study":       { label: "Case",     bg: "bg-blue-100",   text: "text-blue-700"   },
  "portfolio":        { label: "Work",     bg: "bg-blue-100",   text: "text-blue-700"   },
  "blog":             { label: "Article",  bg: "bg-green-100",  text: "text-green-700"  },
  "academy":          { label: "Guide",    bg: "bg-green-100",  text: "text-green-700"  },
  "tool":             { label: "Tool",     bg: "bg-purple-100", text: "text-purple-700" },
  "industry":         { label: "Industry", bg: "bg-slate-100",  text: "text-slate-600"  },
  "location":         { label: "Local",    bg: "bg-slate-100",  text: "text-slate-600"  },
  "page":             { label: "Page",     bg: "bg-slate-100",  text: "text-slate-600"  },
};

function RecTypeBadge({ type }: { type: Recommendation["type"] }) {
  const { label, bg, text } = REC_BADGE[type] ?? REC_BADGE["page"];
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
