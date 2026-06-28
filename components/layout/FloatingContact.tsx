"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const CONTACT = {
  phone: "+97150XXXXXXX",
  whatsapp: "97150XXXXXXX",
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.122 1.528 5.856L.057 23.882a.5.5 0 00.61.61l6.026-1.471A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.375l-.36-.214-3.727.91.924-3.617-.235-.372A9.773 9.773 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818s9.818 4.398 9.818 9.818-4.398 9.818-9.818 9.818z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem("fc-dismissed") === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem("fc-dismissed", "1");
    } catch {}
    setDismissed(true);
    setOpen(false);
  }

  if (dismissed) return null;

  const actions = [
    {
      label: "WhatsApp",
      href: `https://wa.me/${CONTACT.whatsapp}`,
      icon: <WhatsAppIcon />,
      bg: "bg-green-500 hover:bg-green-600",
      external: true,
    },
    {
      label: "Call Us",
      href: `tel:${CONTACT.phone}`,
      icon: <PhoneIcon />,
      bg: "bg-blue-600 hover:bg-blue-700",
      external: false,
    },
    {
      label: "Get a Quote",
      href: "/request-for-a-proposal",
      icon: <QuoteIcon />,
      bg: "ems-gradient-bg hover:brightness-110",
      external: false,
    },
  ];

  return (
    <>
      {/* ── Desktop (lg+): fixed side panel ─────────────────────────────── */}
      <div className="hidden lg:flex fixed bottom-8 right-6 z-50 flex-col items-end gap-2">
        <div className="flex flex-col gap-2 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact Us</span>
            <button
              onClick={dismiss}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
              aria-label="Dismiss contact widget"
            >
              <CloseIcon />
            </button>
          </div>
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${action.bg}`}
            >
              {action.icon}
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Mobile (<lg): expandable FAB ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
        {open && (
          <div className="flex flex-col gap-2 mb-1">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all ${action.bg}`}
              >
                {action.icon}
                {action.label}
              </a>
            ))}
            <button
              onClick={dismiss}
              className="self-end text-xs text-slate-400 hover:text-slate-600 transition-colors pr-1 pt-0.5"
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close contact menu" : "Open contact menu"}
          aria-expanded={open}
          className="w-14 h-14 rounded-full ems-btn-gradient active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200"
        >
          {open ? <CloseIcon /> : <PhoneIcon />}
        </button>
      </div>
    </>
  );
}
