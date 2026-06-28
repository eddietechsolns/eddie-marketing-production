"use client";

import { useState, useCallback, useEffect } from "react";
import type { Tool } from "@/lib/tools-data";

interface ToolInteractiveProps {
  tool: Tool;
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
    </label>
  );
}

function NumberInput({
  id, label, value, onChange, min, max, step, unit, placeholder,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  min?: number; max?: number; step?: number; unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min} max={max} step={step}
          placeholder={placeholder ?? "0"}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function TextInput({
  id, label, value, onChange, placeholder, multiline,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors";
  return (
    <div>
      <Label>{label}</Label>
      {multiline ? (
        <textarea
          id={id} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={3} className={cls + " resize-none"}
        />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function SelectInput({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ResultCard({ label, value, highlight, note }: { label: string; value: string; highlight?: boolean; note?: string }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-blue-600 text-white" : "bg-slate-50 border border-slate-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${highlight ? "text-blue-200" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{value}</p>
      {note && <p className={`text-xs mt-1 ${highlight ? "text-blue-200" : "text-slate-400"}`}>{note}</p>}
    </div>
  );
}

function RunButton({ onClick, label = "Calculate" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
    >
      {label}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
    >
      {copied ? (
        <><svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
      ) : (
        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
      )}
    </button>
  );
}

function ToolShell({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {(title || description) && (
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
          {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Individual tool calculators / generators ─────────────────────────────────

function fmt(n: number, decimals = 2) {
  if (isNaN(n) || !isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}
function fmtInt(n: number) {
  if (isNaN(n) || !isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}
function pct(n: number) { return fmt(n) + "%"; }

// ── Meta Title Generator ───────────────────────────────────────────────────────
function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [pageType, setPageType] = useState("service");
  const [usp, setUsp] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const generate = useCallback(() => {
    if (!keyword.trim()) return;
    const k = keyword.trim();
    const b = brand.trim();
    const u = usp.trim();
    const sep = b ? ` | ${b}` : "";
    const titles: string[] = [];
    if (pageType === "service") {
      titles.push(`${k} Services${sep}`);
      titles.push(`Expert ${k}${u ? ` — ${u}` : ""}${sep}`);
      titles.push(`Professional ${k} Company${sep}`);
      titles.push(`${k} Agency${u ? ` | ${u}` : ""}${sep}`);
      titles.push(`Top-Rated ${k} Services${sep}`);
    } else if (pageType === "blog") {
      titles.push(`What Is ${k}? A Complete Guide`);
      titles.push(`The Ultimate Guide to ${k} in 2025`);
      titles.push(`${k}: Everything You Need to Know`);
      titles.push(`How to Improve Your ${k} Results`);
      titles.push(`${k} Tips & Strategies for Better Results`);
    } else if (pageType === "homepage") {
      titles.push(b ? `${b} — ${k}` : `${k} — Expert Solutions`);
      titles.push(`${k}${u ? ` | ${u}` : ""}${sep}`);
      titles.push(`${k} Services & Solutions${sep}`);
      titles.push(`${b || k} | Digital Marketing Agency`);
      titles.push(`${k} Experts${sep}`);
    } else {
      titles.push(`${k}${sep}`);
      titles.push(`${k}${u ? ` — ${u}` : ""}${sep}`);
      titles.push(`${k} | Expert Solutions${b ? ` | ${b}` : ""}`);
      titles.push(`Get the Best ${k}${sep}`);
      titles.push(`${k} — Learn More${sep}`);
    }
    setResults(titles);
  }, [keyword, brand, pageType, usp]);

  return (
    <ToolShell title="Meta Title & Description Generator" description="Generate click-worthy meta titles tailored to your page type and keywords.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextInput id="keyword" label="Primary Keyword" value={keyword} onChange={setKeyword} placeholder="e.g. SEO Services Dubai" />
        <TextInput id="brand" label="Brand Name (optional)" value={brand} onChange={setBrand} placeholder="e.g. Eddie Marketing" />
        <SelectInput id="pageType" label="Page Type" value={pageType} onChange={setPageType}
          options={[
            { label: "Service Page", value: "service" },
            { label: "Blog Post", value: "blog" },
            { label: "Homepage", value: "homepage" },
            { label: "Landing Page", value: "landing" },
          ]}
        />
        <TextInput id="usp" label="Unique Selling Point (optional)" value={usp} onChange={setUsp} placeholder="e.g. No Long-Term Contracts" />
      </div>
      <RunButton onClick={generate} label="Generate Titles" />

      {results.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Generated Titles</p>
          {results.map((t, i) => (
            <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{t}</p>
                <p className={`text-xs mt-0.5 ${t.length > 60 ? "text-red-500" : t.length > 50 ? "text-amber-500" : "text-green-600"}`}>
                  {t.length} chars {t.length > 60 ? "⚠ too long" : t.length <= 55 ? "✓ ideal" : "acceptable"}
                </p>
              </div>
              <CopyButton text={t} />
            </div>
          ))}
          <p className="text-xs text-slate-400 mt-3">💡 Tip: Also add a meta description (120–155 chars) summarising the page with a CTA like "Get a free quote today."</p>
        </div>
      )}
    </ToolShell>
  );
}

// ── Keyword Difficulty Estimator ───────────────────────────────────────────────
function KeywordDifficultyEstimator() {
  const [volume, setVolume] = useState("");
  const [highDA, setHighDA] = useState("");
  const [myDA, setMyDA] = useState("");
  const [result, setResult] = useState<null | { score: number; label: string; recommendation: string; color: string }>(null);

  const calculate = useCallback(() => {
    const v = Number(volume) || 0;
    const h = Number(highDA) || 0;
    const d = Number(myDA) || 0;
    const volumeScore = Math.min(v / 10000, 1) * 30;
    const compScore = Math.min(h / 10, 1) * 40;
    const daScore = Math.max(0, 1 - d / 80) * 30;
    const total = Math.round(volumeScore + compScore + daScore);
    let label = "Very Easy";
    let recommendation = "Excellent opportunity — target this keyword now with a focused page or blog post.";
    let color = "bg-green-500";
    if (total > 75) { label = "Very Hard"; recommendation = "High investment needed. Build domain authority over 12–24 months before targeting directly."; color = "bg-red-500"; }
    else if (total > 55) { label = "Hard"; recommendation = "Requires significant content investment and link building. Consider long-tail variants first."; color = "bg-red-500"; }
    else if (total > 35) { label = "Medium"; recommendation = "Achievable with quality content, good on-page SEO, and 5–10 backlinks from relevant sites."; color = "bg-amber-500"; }
    else if (total > 15) { label = "Easy"; recommendation = "Solid opportunity. A well-optimised, comprehensive page should rank within 3–6 months."; color = "bg-lime-500"; }
    setResult({ score: total, label, recommendation, color });
  }, [volume, highDA, myDA]);

  return (
    <ToolShell title="Keyword Difficulty Estimator" description="Estimate how competitive a keyword is before committing your SEO resources.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <NumberInput id="volume" label="Monthly Search Volume" value={volume} onChange={setVolume} min={0} placeholder="e.g. 5000" />
        <NumberInput id="highDA" label="High-DA Domains on Page 1" value={highDA} onChange={setHighDA} min={0} max={10} placeholder="e.g. 7" />
        <NumberInput id="myDA" label="Your Domain Authority" value={myDA} onChange={setMyDA} min={0} max={100} placeholder="e.g. 30" />
      </div>
      <RunButton onClick={calculate} label="Estimate Difficulty" />

      {result && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray={`${result.score} ${100 - result.score}`} className="text-blue-600"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900">{result.score}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{result.label}</p>
              <p className="text-sm text-slate-500">Difficulty score: {result.score}/100</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-1">Recommendation</p>
            <p className="text-sm text-blue-800">{result.recommendation}</p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── SERP CTR Calculator ────────────────────────────────────────────────────────
const CTR_BENCHMARKS: Record<number, number> = {
  1: 31.7, 2: 24.7, 3: 18.7, 4: 13.6, 5: 9.5, 6: 6.6, 7: 4.9, 8: 3.9, 9: 3.3, 10: 2.6,
};

function SerpCTRCalculator() {
  const [volume, setVolume] = useState("");
  const [position, setPosition] = useState("1");
  const [results, setResults] = useState<null | { clicks: number; ctr: number; annualClicks: number; gainNext: number }>(null);

  const calculate = useCallback(() => {
    const v = Number(volume) || 0;
    const pos = Number(position);
    const ctr = CTR_BENCHMARKS[pos] ?? 2;
    const clicks = Math.round(v * (ctr / 100));
    const nextCTR = pos > 1 ? (CTR_BENCHMARKS[pos - 1] ?? ctr) : ctr;
    const gainNext = Math.round(v * (nextCTR / 100)) - clicks;
    setResults({ clicks, ctr, annualClicks: clicks * 12, gainNext });
  }, [volume, position]);

  return (
    <ToolShell title="SERP Click-Through Rate Calculator" description="Estimate organic traffic based on search volume and ranking position.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="volume" label="Monthly Search Volume" value={volume} onChange={setVolume} min={0} placeholder="e.g. 2000" />
        <SelectInput id="position" label="Current / Target Position" value={position} onChange={setPosition}
          options={Array.from({ length: 10 }, (_, i) => ({
            label: `Position ${i + 1} (~${CTR_BENCHMARKS[i + 1]}% CTR)`,
            value: String(i + 1),
          }))}
        />
      </div>
      <RunButton onClick={calculate} />
      {results && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultCard label="Monthly Clicks" value={fmtInt(results.clicks)} highlight />
          <ResultCard label="Annual Clicks" value={fmtInt(results.annualClicks)} />
          <ResultCard label="Extra Clicks (move up 1)" value={`+${fmtInt(results.gainNext)}/mo`} note={Number(position) === 1 ? "Already position 1!" : "By moving to position " + (Number(position) - 1)} />
        </div>
      )}
    </ToolShell>
  );
}

// ── Robots.txt Generator ───────────────────────────────────────────────────────
function RobotsTxtGenerator() {
  const [cms, setCms] = useState("wordpress");
  const [blockAdmin, setBlockAdmin] = useState(true);
  const [blockSearch, setBlockSearch] = useState(true);
  const [blockCart, setBlockCart] = useState(false);
  const [customDisallow, setCustomDisallow] = useState("");
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    const lines: string[] = ["User-agent: *"];
    if (cms === "wordpress") {
      if (blockAdmin) { lines.push("Disallow: /wp-admin/"); lines.push("Disallow: /wp-login.php"); }
      if (blockSearch) lines.push("Disallow: /?s=");
      lines.push("Allow: /wp-admin/admin-ajax.php");
    } else if (cms === "shopify") {
      if (blockAdmin) lines.push("Disallow: /admin/");
      if (blockCart) lines.push("Disallow: /cart");
      lines.push("Disallow: /checkout");
      lines.push("Disallow: /orders");
    } else if (cms === "custom") {
      if (blockAdmin) lines.push("Disallow: /admin/");
      if (blockSearch) lines.push("Disallow: /search");
    }
    if (customDisallow.trim()) {
      customDisallow.split("\n").forEach((line) => {
        const l = line.trim();
        if (l) lines.push(`Disallow: ${l.startsWith("/") ? l : "/" + l}`);
      });
    }
    lines.push("");
    lines.push("Sitemap: https://yourdomain.com/sitemap.xml");
    setOutput(lines.join("\n"));
  }, [cms, blockAdmin, blockSearch, blockCart, customDisallow]);

  return (
    <ToolShell title="Robots.txt Generator" description="Generate a valid robots.txt file for your CMS. Upload it to your site root after testing.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <SelectInput id="cms" label="CMS / Platform" value={cms} onChange={setCms}
          options={[
            { label: "WordPress", value: "wordpress" },
            { label: "Shopify", value: "shopify" },
            { label: "Custom / Other", value: "custom" },
          ]}
        />
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {[
              { key: "admin", label: "Block admin/login pages", value: blockAdmin, set: setBlockAdmin },
              { key: "search", label: "Block search result pages", value: blockSearch, set: setBlockSearch },
              ...(cms === "shopify" ? [{ key: "cart", label: "Block cart page", value: blockCart, set: setBlockCart }] : []),
            ].map((opt) => (
              <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={opt.value} onChange={(e) => opt.set(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <TextInput id="custom" label="Custom Disallow paths (one per line, optional)" value={customDisallow} onChange={setCustomDisallow}
            multiline placeholder="/staging/&#10;/private/&#10;/tmp/"
          />
        </div>
      </div>
      <RunButton onClick={generate} label="Generate robots.txt" />
      {output && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Output</p>
            <CopyButton text={output} />
          </div>
          <pre className="bg-slate-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto leading-relaxed font-mono whitespace-pre">{output}</pre>
          <p className="text-xs text-slate-400 mt-2">⚠️ Replace <code className="bg-slate-100 px-1 rounded">yourdomain.com</code> with your actual domain. Test using Google Search Console before uploading.</p>
        </div>
      )}
    </ToolShell>
  );
}

// ── SEO Audit Checklist ────────────────────────────────────────────────────────
const SEO_CHECKLIST = [
  {
    section: "Technical SEO",
    items: [
      "HTTPS enabled with valid SSL certificate",
      "XML sitemap submitted to Google Search Console",
      "Robots.txt file present and correctly configured",
      "No crawl errors in Google Search Console",
      "Canonical tags on all key pages",
      "Structured data (JSON-LD) on relevant pages",
      "Core Web Vitals passing (LCP, INP, CLS)",
      "Mobile-friendly (Google Mobile Test passes)",
      "No broken internal links",
      "Clean URL structure (no duplicate parameter URLs)",
    ],
  },
  {
    section: "On-Page SEO",
    items: [
      "Unique, keyword-optimised meta title on every page",
      "Unique meta description on every page",
      "Single H1 tag per page with primary keyword",
      "Logical H2/H3 heading hierarchy",
      "Primary keyword in first 100 words of body",
      "Images have descriptive alt text",
      "Internal links to related pages with descriptive anchor text",
      "Keyword appears in URL slug",
      "No keyword stuffing or unnatural repetition",
      "Schema markup for page type (Article, Service, LocalBusiness)",
    ],
  },
  {
    section: "Content Quality",
    items: [
      "Content answers search intent (informational, transactional, navigational)",
      "No duplicate or thin content pages",
      "All content is original and not plagiarised",
      "Content is regularly updated (within last 12 months)",
      "Blog posts exceed 1,000 words for target keywords",
      "Clear calls-to-action on all commercial pages",
      "Contact page indexed and easily findable",
      "About page with author/company information",
      "Privacy Policy and Terms of Service pages exist",
      "404 error page provides navigation options",
    ],
  },
  {
    section: "Off-Page & Authority",
    items: [
      "Google Business Profile claimed and optimised",
      "Business listed in relevant UAE/regional directories",
      "NAP (Name, Address, Phone) consistent across all listings",
      "Backlink profile has no toxic/spammy links",
      "Disavow file updated if needed",
      "Social profiles linked and active",
      "Active link-building strategy in place",
      "Earned coverage or mentions from industry publications",
      "Monitored brand mentions and unlinked brand citations",
      "No Google Manual Actions in Search Console",
    ],
  },
  {
    section: "Local SEO",
    items: [
      "Google Business Profile fully completed with photos",
      "Consistent NAP across Google, Bing Places, Apple Maps",
      "Localised landing pages for each service area",
      "Reviews actively requested and responded to",
      "Local schema markup (LocalBusiness) on contact page",
    ],
  },
];

function SeoAuditChecklist() {
  const allItems = SEO_CHECKLIST.flatMap((s) => s.items.map((item) => `${s.section}::${item}`));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const pctDone = Math.round((checked.size / allItems.length) * 100);

  return (
    <ToolShell title="SEO Audit Checklist" description="Work through all 50 points. Your progress is saved in this session.">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">{checked.size} / {allItems.length} complete</p>
          <p className="text-sm font-bold text-blue-600">{pctDone}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${pctDone}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {SEO_CHECKLIST.map((section) => {
          const sectionDone = section.items.filter((item) => checked.has(`${section.section}::${item}`)).length;
          return (
            <div key={section.section}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900">{section.section}</h4>
                <span className="text-xs text-slate-400">{sectionDone}/{section.items.length}</span>
              </div>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const key = `${section.section}::${item}`;
                  const done = checked.has(key);
                  return (
                    <label key={key} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${done ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100 hover:border-slate-200"}`}>
                      <input type="checkbox" checked={done} onChange={() => toggle(key)}
                        className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 mt-0.5 shrink-0"
                      />
                      <span className={`text-sm ${done ? "text-green-800 line-through" : "text-slate-700"}`}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}

// ── Google Ads Budget Calculator ───────────────────────────────────────────────
function GoogleAdsBudgetCalculator() {
  const [targetLeads, setTargetLeads] = useState("");
  const [convRate, setConvRate] = useState("3");
  const [cpc, setCpc] = useState("");
  const [convValue, setConvValue] = useState("");
  const [results, setResults] = useState<null | { budget: number; clicks: number; spend: number; revenue: number; roas: number }>(null);

  const calculate = useCallback(() => {
    const leads = Number(targetLeads) || 0;
    const cr = Number(convRate) / 100;
    const avgCpc = Number(cpc) || 0;
    const cv = Number(convValue) || 0;
    if (!cr || !avgCpc) return;
    const clicks = Math.round(leads / cr);
    const spend = clicks * avgCpc;
    const revenue = leads * cv;
    const roas = spend > 0 ? revenue / spend : 0;
    setResults({ budget: spend, clicks, spend, revenue, roas });
  }, [targetLeads, convRate, cpc, convValue]);

  return (
    <ToolShell title="Google Ads Budget Calculator" description="Work backwards from your conversion target to find the right monthly budget.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="leads" label="Monthly Conversions Target" value={targetLeads} onChange={setTargetLeads} min={0} placeholder="e.g. 30" />
        <NumberInput id="cr" label="Expected Conversion Rate" value={convRate} onChange={setConvRate} min={0.1} max={100} step={0.1} unit="%" placeholder="3" />
        <NumberInput id="cpc" label="Average Cost-Per-Click (AED)" value={cpc} onChange={setCpc} min={0} placeholder="e.g. 8.50" unit="AED" />
        <NumberInput id="cv" label="Value Per Conversion (AED)" value={convValue} onChange={setConvValue} min={0} placeholder="e.g. 1500" unit="AED" />
      </div>
      <RunButton onClick={calculate} label="Calculate Budget" />
      {results && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultCard label="Monthly Budget" value={`AED ${fmtInt(results.budget)}`} highlight />
          <ResultCard label="Est. Clicks" value={fmtInt(results.clicks)} />
          <ResultCard label="Revenue Potential" value={`AED ${fmtInt(results.revenue)}`} />
          <ResultCard label="Expected ROAS" value={`${fmt(results.roas, 1)}×`} note={results.roas >= 3 ? "✓ Profitable" : "⚠ Review margins"} />
        </div>
      )}
    </ToolShell>
  );
}

// ── ROAS Calculator ────────────────────────────────────────────────────────────
function RoasCalculator() {
  const [spend, setSpend] = useState("");
  const [revenue, setRevenue] = useState("");
  const [margin, setMargin] = useState("40");
  const [results, setResults] = useState<null | { roas: number; grossProfit: number; netProfit: number; profitable: boolean }>(null);

  const calculate = useCallback(() => {
    const s = Number(spend) || 0;
    const r = Number(revenue) || 0;
    const m = Number(margin) / 100;
    if (!s) return;
    const roas = r / s;
    const grossProfit = r * m;
    const netProfit = grossProfit - s;
    setResults({ roas, grossProfit, netProfit, profitable: netProfit > 0 });
  }, [spend, revenue, margin]);

  return (
    <ToolShell title="ROAS & Profit Calculator" description="Calculate your true campaign profitability, not just revenue.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <NumberInput id="spend" label="Ad Spend (AED)" value={spend} onChange={setSpend} min={0} unit="AED" placeholder="e.g. 10000" />
        <NumberInput id="revenue" label="Revenue Attributed (AED)" value={revenue} onChange={setRevenue} min={0} unit="AED" placeholder="e.g. 45000" />
        <NumberInput id="margin" label="Gross Margin" value={margin} onChange={setMargin} min={1} max={100} unit="%" placeholder="40" />
      </div>
      <RunButton onClick={calculate} />
      {results && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <ResultCard label="ROAS" value={`${fmt(results.roas, 1)}×`} highlight />
            <ResultCard label="Gross Profit" value={`AED ${fmtInt(results.grossProfit)}`} />
            <ResultCard label="Net Profit" value={`AED ${fmtInt(results.netProfit)}`} note={results.profitable ? "✓ Profitable" : "⚠ Unprofitable"} />
          </div>
          <div className={`p-4 rounded-xl ${results.profitable ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
            <p className={`text-sm font-semibold ${results.profitable ? "text-green-800" : "text-red-800"}`}>
              {results.profitable
                ? `✓ Campaign profitable — AED ${fmtInt(results.netProfit)} net profit. Minimum break-even ROAS at ${margin}% margin is ${fmt(100 / Number(margin), 1)}×.`
                : `⚠ Campaign unprofitable. You need a ROAS of ${fmt(100 / Number(margin), 1)}× to break even at ${margin}% margin. Current: ${fmt(results.roas, 1)}×.`}
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Ad Copy Generator ──────────────────────────────────────────────────────────
function AdCopyGenerator() {
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [audience, setAudience] = useState("");
  const [cta, setCta] = useState("Get a Free Quote");
  const [results, setResults] = useState<{ headlines: string[]; descriptions: string[] } | null>(null);

  const generate = useCallback(() => {
    if (!product.trim()) return;
    const p = product.trim();
    const b = benefit.trim() || "Expert Results";
    const a = audience.trim() || "businesses";
    const headlines = [
      `${p.slice(0, 28)}`, `Expert ${p.slice(0, 22)}`, `${b.slice(0, 29)}`,
      `${cta.slice(0, 29)}`, `Trusted by ${a.slice(0, 18)}`, `#1 ${p.slice(0, 26)}`,
      `${p.slice(0, 20)} Specialists`, `Proven ${p.slice(0, 22)}`, `${b.slice(0, 22)} Today`,
      `Top-Rated ${p.slice(0, 19)}`, `Results-Driven ${p.slice(0, 14)}`,
      `UAE's Leading ${p.slice(0, 15)}`, `${p.slice(0, 18)} That Works`,
      `Free ${p.slice(0, 24)} Audit`, `${a.slice(0, 10)} Love Us`,
    ].map((h) => h.slice(0, 30));
    const descriptions = [
      `${p} for ${a}. ${b}. ${cta} — no commitment required.`.slice(0, 90),
      `Trusted ${p} specialists. Proven results for ${a}. ${cta} today.`.slice(0, 90),
      `${b}. Our ${p} team delivers measurable ROI for ${a}. ${cta}.`.slice(0, 90),
      `Stop wasting budget. Our ${p} experts drive real results. ${cta} today.`.slice(0, 90),
    ];
    setResults({ headlines, descriptions });
  }, [product, benefit, audience, cta]);

  return (
    <ToolShell title="Google Ads Copy Generator" description="Generate RSA-compliant headlines (≤30 chars) and descriptions (≤90 chars).">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextInput id="product" label="Product / Service" value={product} onChange={setProduct} placeholder="e.g. SEO Services" />
        <TextInput id="benefit" label="Key Benefit / USP" value={benefit} onChange={setBenefit} placeholder="e.g. No Long-Term Contracts" />
        <TextInput id="audience" label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. Dubai SMEs" />
        <TextInput id="cta" label="Call to Action" value={cta} onChange={setCta} placeholder="e.g. Get a Free Quote" />
      </div>
      <RunButton onClick={generate} label="Generate Ad Copy" />
      {results && (
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Headlines ({results.headlines.length})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.headlines.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-sm text-slate-800 font-medium">{h}</span>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className={`text-xs font-semibold ${h.length > 30 ? "text-red-500" : "text-green-600"}`}>{h.length}/30</span>
                    <CopyButton text={h} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Descriptions (4)</p>
            <div className="space-y-2">
              {results.descriptions.map((d, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-800">{d}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold ${d.length > 90 ? "text-red-500" : "text-green-600"}`}>{d.length}/90</span>
                    <CopyButton text={d} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Quality Score Guide (Reference) ────────────────────────────────────────────
const QS_SECTIONS = [
  {
    title: "Expected CTR",
    weight: "Highest weight",
    description: "Google's estimate of how likely your ad is to be clicked relative to competitors at the same position.",
    scores: [
      { label: "Below Average (1–3)", action: "Rewrite headlines with a stronger value proposition. Add numbers, power words, and a clear CTA. Test at least 3 headline variations." },
      { label: "Average (4–6)", action: "Your CTR is acceptable but improvable. A/B test headline formats (questions vs. statements vs. numbers). Add ad extensions to take up more SERP space." },
      { label: "Above Average (7–10)", action: "Maintain by continuing to test new headlines. Don't change what's working, but keep adding variants to avoid creative fatigue." },
    ],
  },
  {
    title: "Ad Relevance",
    weight: "Moderate weight",
    description: "How closely your ad copy matches the intent of the search query that triggered it.",
    scores: [
      { label: "Below Average", action: "Tighten match types. Create single-keyword ad groups (SKAGs) or small tightly-themed ad groups. Include the exact keyword in at least one headline." },
      { label: "Average", action: "Review your Search Terms report. Group keywords by intent and create separate ad groups for different themes to improve relevance." },
      { label: "Above Average", action: "Excellent relevance — maintain by keeping ad groups tightly themed and reviewing search terms monthly." },
    ],
  },
  {
    title: "Landing Page Experience",
    weight: "High weight",
    description: "How relevant, useful, and trustworthy Google considers your landing page to be for users clicking the ad.",
    scores: [
      { label: "Below Average", action: "Match the landing page headline to the ad copy. Improve page load speed (target LCP < 2.5s). Add trust signals: reviews, logos, guarantees. Ensure the page is mobile-friendly." },
      { label: "Average", action: "Improve time-on-page signals by making content more engaging. Add video, case studies, or testimonials. Ensure the primary CTA is above the fold." },
      { label: "Above Average", action: "Excellent — maintain by keeping landing pages fast, relevant, and regularly updated with fresh content and social proof." },
    ],
  },
];

function QualityScoreGuide() {
  const [activeSection, setActiveSection] = useState(0);
  return (
    <ToolShell title="Quality Score Improvement Guide" description="Diagnose and fix each Quality Score component with specific actions.">
      <div className="flex gap-2 mb-5 flex-wrap">
        {QS_SECTIONS.map((s, i) => (
          <button key={i} onClick={() => setActiveSection(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSection === i ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div>
        {QS_SECTIONS.map((section, i) => i !== activeSection ? null : (
          <div key={i}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-bold text-slate-900">{section.title}</h4>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">{section.weight}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{section.description}</p>
            <div className="space-y-3">
              {section.scores.map((score, j) => (
                <div key={j} className={`p-4 rounded-xl border ${j === 0 ? "border-red-100 bg-red-50" : j === 1 ? "border-amber-100 bg-amber-50" : "border-green-100 bg-green-50"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${j === 0 ? "text-red-600" : j === 1 ? "text-amber-600" : "text-green-600"}`}>{score.label}</p>
                  <p className="text-sm text-slate-700">{score.action}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

// ── Engagement Rate Calculator ─────────────────────────────────────────────────
const PLATFORM_BENCHMARKS: Record<string, { good: number; great: number; formula: string }> = {
  instagram: { good: 1, great: 3, formula: "(Likes + Comments + Saves) / Followers × 100" },
  linkedin: { good: 1.5, great: 2.5, formula: "(Reactions + Comments + Reposts) / Followers × 100" },
  facebook: { good: 0.5, great: 1.5, formula: "(Reactions + Comments + Shares) / Reach × 100" },
  tiktok: { good: 3, great: 6, formula: "(Likes + Comments + Shares) / Views × 100" },
  twitter: { good: 0.3, great: 1, formula: "(Likes + Replies + Retweets) / Impressions × 100" },
};

function EngagementRateCalculator() {
  const [platform, setPlatform] = useState("instagram");
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [result, setResult] = useState<null | { rate: number; benchmark: string; tip: string }>(null);

  const calculate = useCallback(() => {
    const f = Number(followers) || 1;
    const total = (Number(likes) + Number(comments) + Number(shares));
    const rate = (total / f) * 100;
    const bench = PLATFORM_BENCHMARKS[platform];
    const benchmark = rate >= bench.great ? "Excellent 🎉" : rate >= bench.good ? "Good ✓" : "Below average — needs improvement";
    const tip = rate < bench.good
      ? `Your rate is below the ${platform} benchmark of ${bench.good}%. Post more consistently, respond to every comment, and experiment with Reels/video content.`
      : `You're performing well for ${platform}. Keep testing content formats and posting times to push above ${bench.great}%.`;
    setResult({ rate, benchmark, tip });
  }, [platform, followers, likes, comments, shares]);

  return (
    <ToolShell title="Social Media Engagement Rate Calculator" description="Calculate and benchmark your engagement rate across platforms.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <SelectInput id="platform" label="Platform" value={platform} onChange={setPlatform}
          options={[
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Facebook", value: "facebook" },
            { label: "TikTok", value: "tiktok" },
            { label: "X (Twitter)", value: "twitter" },
          ]}
        />
        <NumberInput id="followers" label="Followers / Reach" value={followers} onChange={setFollowers} min={1} placeholder="e.g. 5000" />
        <NumberInput id="likes" label="Avg Likes per Post" value={likes} onChange={setLikes} min={0} placeholder="e.g. 120" />
        <NumberInput id="comments" label="Avg Comments per Post" value={comments} onChange={setComments} min={0} placeholder="e.g. 15" />
        <NumberInput id="shares" label="Avg Shares/Saves per Post" value={shares} onChange={setShares} min={0} placeholder="e.g. 8" />
      </div>
      <RunButton onClick={calculate} />
      {result && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ResultCard label="Engagement Rate" value={`${fmt(result.rate, 2)}%`} highlight />
            <ResultCard label="Assessment" value={result.benchmark} note={`${platform} good: ≥${PLATFORM_BENCHMARKS[platform].good}%, great: ≥${PLATFORM_BENCHMARKS[platform].great}%`} />
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm text-blue-800">{result.tip}</p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Hashtag Generator ──────────────────────────────────────────────────────────
const HASHTAG_DB: Record<string, string[][]> = {
  marketing: [
    ["#digitalmarketing", "#marketingstrategy", "#onlinemarketing", "#socialmediamarketing", "#contentmarketing"],
    ["#seo", "#googleads", "#ppc", "#emailmarketing", "#marketingtips"],
    ["#smallbusiness", "#entrepreneur", "#businessgrowth", "#marketingagency", "#dubai"],
  ],
  real_estate: [
    ["#realestate", "#dubaiproperties", "#propertyinvestment", "#luxuryrealestate", "#uaerealestate"],
    ["#dubaimarketplace", "#dubaihousing", "#propertydubai", "#dubairealestate", "#investindubai"],
    ["#househunting", "#newlisting", "#homesale", "#propertymanagement", "#realestateinvesting"],
  ],
  restaurant: [
    ["#dubairestaurants", "#fooddubai", "#dubaifoodie", "#uaefood", "#restaurantdubai"],
    ["#foodphotography", "#instafood", "#foodie", "#yummy", "#restaurant"],
    ["#dinersclub", "#newrestaurant", "#foodlover", "#halal", "#arabfood"],
  ],
  technology: [
    ["#technology", "#tech", "#innovation", "#ai", "#artificialintelligence"],
    ["#saas", "#startup", "#fintech", "#cloudcomputing", "#cybersecurity"],
    ["#dubai", "#uae", "#techstartup", "#digitaltransformation", "#b2b"],
  ],
  fashion: [
    ["#fashion", "#style", "#ootd", "#fashionista", "#luxuryfashion"],
    ["#dubaifashion", "#uaefashion", "#arabicfashion", "#moda", "#fashionblogger"],
    ["#streetstyle", "#womensfashion", "#mensfashion", "#trending", "#newcollection"],
  ],
  healthcare: [
    ["#health", "#wellness", "#healthcare", "#medicaladvice", "#healthtips"],
    ["#dubaihealth", "#uaehealthcare", "#doctor", "#hospital", "#medical"],
    ["#mentalhealth", "#fitness", "#nutrition", "#healthylifestyle", "#wellbeing"],
  ],
};

function HashtagGenerator() {
  const [industry, setIndustry] = useState("marketing");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [results, setResults] = useState<string[] | null>(null);

  const generate = useCallback(() => {
    const base = HASHTAG_DB[industry] ?? HASHTAG_DB.marketing;
    const topicTags = topic.trim()
      ? [`#${topic.replace(/\s+/g, "").toLowerCase()}`, `#${topic.replace(/\s+/g, "_").toLowerCase()}`]
      : [];
    const platformLimits: Record<string, number> = { instagram: 20, linkedin: 5, tiktok: 10, facebook: 8, twitter: 3 };
    const limit = platformLimits[platform] ?? 10;
    const allTags = [...topicTags, ...base.flat()];
    setResults(allTags.slice(0, limit));
  }, [industry, topic, platform]);

  const hashtagText = results?.join(" ") ?? "";

  return (
    <ToolShell title="Hashtag Strategy Generator" description="Generate a platform-optimised hashtag set for your post.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <SelectInput id="industry" label="Industry" value={industry} onChange={setIndustry}
          options={[
            { label: "Marketing & Agency", value: "marketing" },
            { label: "Real Estate", value: "real_estate" },
            { label: "Restaurant & Food", value: "restaurant" },
            { label: "Technology", value: "technology" },
            { label: "Fashion & Retail", value: "fashion" },
            { label: "Healthcare", value: "healthcare" },
          ]}
        />
        <SelectInput id="platform" label="Platform" value={platform} onChange={setPlatform}
          options={[
            { label: "Instagram (up to 20)", value: "instagram" },
            { label: "LinkedIn (up to 5)", value: "linkedin" },
            { label: "TikTok (up to 10)", value: "tiktok" },
            { label: "Facebook (up to 8)", value: "facebook" },
            { label: "X / Twitter (up to 3)", value: "twitter" },
          ]}
        />
        <div className="sm:col-span-2">
          <TextInput id="topic" label="Topic or Post Keyword (optional)" value={topic} onChange={setTopic} placeholder="e.g. social media tips" />
        </div>
      </div>
      <RunButton onClick={generate} label="Generate Hashtags" />
      {results && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{results.length} hashtags</p>
            <CopyButton text={hashtagText} />
          </div>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {results.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Blog Title Generator ───────────────────────────────────────────────────────
function BlogTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("how-to");
  const [results, setResults] = useState<string[]>([]);

  const generate = useCallback(() => {
    if (!topic.trim()) return;
    const t = topic.trim();
    const a = audience.trim() || "marketers";
    const templates: Record<string, string[]> = {
      "how-to": [
        `How to Master ${t} in 30 Days`,
        `How to Use ${t} to Grow Your Business in 2025`,
        `How to Get Started with ${t} (Step-by-Step)`,
        `How to Improve Your ${t} Results Without Spending More`,
        `How ${t} Can Transform Your Marketing Strategy`,
        `How ${a} Are Using ${t} to Drive Real Growth`,
        `How to Build a ${t} Strategy From Scratch`,
        `How to Measure the ROI of Your ${t} Efforts`,
        `How to Avoid the Biggest ${t} Mistakes`,
        `How to Scale Your ${t} in the UAE Market`,
      ],
      "listicle": [
        `10 ${t} Strategies That Actually Work in 2025`,
        `7 Ways ${a} Are Winning with ${t}`,
        `15 ${t} Tips Every Business Should Know`,
        `5 ${t} Mistakes That Are Costing You Money`,
        `12 Proven ${t} Techniques for Faster Growth`,
        `8 ${t} Tools That Save Time and Drive Results`,
        `The Top 6 ${t} Trends for UAE Businesses`,
        `9 Reasons Your ${t} Isn't Working (And How to Fix It)`,
        `7 ${t} Lessons From Businesses That Doubled Their Revenue`,
        `11 ${t} Quick Wins You Can Implement Today`,
      ],
      "guide": [
        `The Complete Guide to ${t} for ${a}`,
        `The Ultimate ${t} Playbook for 2025`,
        `A Beginner's Guide to ${t} in the UAE`,
        `The Advanced ${t} Guide for Serious Marketers`,
        `Your Step-by-Step ${t} Framework`,
        `Everything ${a} Need to Know About ${t}`,
        `The No-Nonsense Guide to ${t} That Actually Works`,
        `${t}: A Practical Guide for UAE Businesses`,
        `The ${t} Blueprint: From Zero to Results`,
        `The Expert's Guide to ${t} in a Competitive Market`,
      ],
      "question": [
        `What Is ${t} and Why Does It Matter for Your Business?`,
        `Is ${t} Worth the Investment? An Honest Assessment`,
        `Why Are ${a} Investing in ${t} Right Now?`,
        `What Makes a Great ${t} Strategy?`,
        `Can Small Businesses Really Benefit from ${t}?`,
        `What's the Difference Between ${t} and Traditional Marketing?`,
        `When Should You Outsource Your ${t}?`,
        `Which ${t} Tactics Deliver the Best ROI?`,
        `How Much Should You Budget for ${t} in 2025?`,
        `What Does ${t} Success Really Look Like?`,
      ],
    };
    setResults(templates[format] ?? templates["how-to"]);
  }, [topic, audience, format]);

  return (
    <ToolShell title="Blog Post Title Generator" description="Generate 10 compelling, SEO-friendly blog post titles ready to use.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextInput id="topic" label="Blog Topic / Primary Keyword" value={topic} onChange={setTopic} placeholder="e.g. Social Media Marketing" />
        <TextInput id="audience" label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. Dubai businesses" />
        <SelectInput id="format" label="Content Format" value={format} onChange={setFormat}
          options={[
            { label: "How-To Guide", value: "how-to" },
            { label: "List / Listicle", value: "listicle" },
            { label: "Definitive Guide", value: "guide" },
            { label: "Question-Based", value: "question" },
          ]}
        />
      </div>
      <RunButton onClick={generate} label="Generate Titles" />
      {results.length > 0 && (
        <div className="mt-5 space-y-2">
          {results.map((title, i) => (
            <div key={i} className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors">
              <p className="text-sm text-slate-800">{title}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold ${title.length > 65 ? "text-amber-500" : "text-green-600"}`}>{title.length} chars</span>
                <CopyButton text={title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

// ── Reading Time Calculator ────────────────────────────────────────────────────
const CONTENT_BENCHMARKS: Record<string, { min: number; max: number; label: string }> = {
  blog: { min: 1000, max: 2500, label: "Blog Post" },
  guide: { min: 2000, max: 5000, label: "Long-form Guide" },
  service: { min: 600, max: 1500, label: "Service Page" },
  email: { min: 150, max: 350, label: "Marketing Email" },
  whitepaper: { min: 3000, max: 8000, label: "Whitepaper" },
};

function ReadingTimeCalculator() {
  const [wordCount, setWordCount] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [result, setResult] = useState<null | { minutes: number; status: string; color: string; tip: string }>(null);

  const calculate = useCallback(() => {
    const words = Number(wordCount) || 0;
    const minutes = Math.max(1, Math.round(words / 238));
    const bench = CONTENT_BENCHMARKS[contentType];
    let status = "On target ✓";
    let color = "text-green-600";
    let tip = `Your ${bench.label} is within the optimal ${bench.min.toLocaleString()}–${bench.max.toLocaleString()} word range.`;
    if (words < bench.min) {
      status = "Too short";
      color = "text-red-500";
      tip = `Add ${(bench.min - words).toLocaleString()} more words to hit the minimum recommended length for a ${bench.label}. Include more examples, FAQs, or case studies.`;
    } else if (words > bench.max) {
      status = "Consider splitting";
      color = "text-amber-500";
      tip = `At ${words.toLocaleString()} words, consider splitting into two posts or using a table of contents. Optimal maximum for a ${bench.label} is ${bench.max.toLocaleString()} words.`;
    }
    setResult({ minutes, status, color, tip });
  }, [wordCount, contentType]);

  return (
    <ToolShell title="Reading Time Calculator" description="Check your content length against best-practice benchmarks for your content type.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="words" label="Word Count" value={wordCount} onChange={setWordCount} min={0} placeholder="e.g. 1500" />
        <SelectInput id="contentType" label="Content Type" value={contentType} onChange={setContentType}
          options={Object.entries(CONTENT_BENCHMARKS).map(([k, v]) => ({ label: v.label, value: k }))}
        />
      </div>
      <RunButton onClick={calculate} label="Check Length" />
      {result && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ResultCard label="Reading Time" value={`${result.minutes} min`} highlight />
            <ResultCard label="Length Status" value={result.status} />
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-700">{result.tip}</p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Email ROI Calculator ───────────────────────────────────────────────────────
function EmailRoiCalculator() {
  const [listSize, setListSize] = useState("");
  const [openRate, setOpenRate] = useState("25");
  const [ctr, setCtr] = useState("3");
  const [convRate, setConvRate] = useState("5");
  const [convValue, setConvValue] = useState("");
  const [result, setResult] = useState<null | { opens: number; clicks: number; convs: number; revenue: number; roiLabel: string }>(null);

  const calculate = useCallback(() => {
    const list = Number(listSize) || 0;
    const opens = Math.round(list * (Number(openRate) / 100));
    const clicks = Math.round(opens * (Number(ctr) / 100));
    const convs = Math.round(clicks * (Number(convRate) / 100));
    const revenue = convs * (Number(convValue) || 0);
    const roi = revenue > 0 ? `AED ${revenue.toLocaleString()} / campaign` : "Enter conversion value";
    setResult({ opens, clicks, convs, revenue, roiLabel: roi });
  }, [listSize, openRate, ctr, convRate, convValue]);

  return (
    <ToolShell title="Email Marketing ROI Calculator" description="Project the revenue potential of each email campaign to your list.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="list" label="Email List Size" value={listSize} onChange={setListSize} placeholder="e.g. 3000" />
        <NumberInput id="open" label="Open Rate" value={openRate} onChange={setOpenRate} unit="%" min={0} max={100} step={0.5} placeholder="25" />
        <NumberInput id="ctr" label="Click-Through Rate" value={ctr} onChange={setCtr} unit="%" min={0} max={100} step={0.1} placeholder="3" />
        <NumberInput id="cr" label="Email-to-Conversion Rate" value={convRate} onChange={setConvRate} unit="%" min={0} max={100} step={0.5} placeholder="5" />
        <NumberInput id="cv" label="Avg Revenue Per Conversion (AED)" value={convValue} onChange={setConvValue} unit="AED" placeholder="e.g. 2000" />
      </div>
      <RunButton onClick={calculate} label="Calculate Revenue" />
      {result && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultCard label="Opens" value={fmtInt(result.opens)} />
          <ResultCard label="Clicks" value={fmtInt(result.clicks)} />
          <ResultCard label="Conversions" value={fmtInt(result.convs)} />
          <ResultCard label="Revenue / Campaign" value={`AED ${fmtInt(result.revenue)}`} highlight />
        </div>
      )}
    </ToolShell>
  );
}

// ── Email Subject Line Tester ─────────────────────────────────────────────────
const SPAM_WORDS = ["free", "guarantee", "winner", "click here", "act now", "earn money", "no risk", "congratulations", "buy now", "order now", "limited time", "urgent"];
const POWER_WORDS = ["exclusive", "new", "discover", "proven", "secret", "instant", "you", "results", "how to", "free", "now"];

function EmailSubjectLineTester() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("b2b");
  const [result, setResult] = useState<null | { score: number; flags: string[]; tips: string[]; alternatives: string[] }>(null);

  const analyse = useCallback(() => {
    if (!subject.trim()) return;
    const s = subject.trim();
    const flags: string[] = [];
    const tips: string[] = [];
    let score = 70;
    if (s.length < 30) { score += 5; tips.push("✓ Good length for mobile display."); }
    else if (s.length > 60) { score -= 10; flags.push(`Too long: ${s.length} chars (aim for 35–50).`); }
    else { score += 3; }
    const spamFound = SPAM_WORDS.filter((w) => s.toLowerCase().includes(w));
    if (spamFound.length) { score -= spamFound.length * 8; flags.push(`Potential spam words: ${spamFound.join(", ")}`); }
    if (/!!!|\?\?\?/.test(s)) { score -= 10; flags.push("Excessive punctuation (!!!, ???) — reduces deliverability."); }
    if (/ALL CAPS/.test(s) || s.toUpperCase() === s) { score -= 10; flags.push("All caps hurts deliverability."); }
    if (/[👋🎉✅💡]/.test(s)) { score += 3; tips.push("✓ Emoji may boost open rate on mobile."); }
    const powerFound = POWER_WORDS.filter((w) => s.toLowerCase().includes(w));
    if (powerFound.length) { score += powerFound.length * 2; tips.push(`✓ Power words detected: ${powerFound.join(", ")}`); }
    if (s.includes("{") || s.toLowerCase().includes("first name") || s.includes("[name]")) {
      score += 5; tips.push("✓ Personalisation token detected (+26% open rate lift).");
    }
    const alternatives = [
      `${s} — See Inside`,
      `You asked about ${s.toLowerCase().replace(/[?!.,]/g, "")}?`,
      `Quick question about ${s.toLowerCase().replace(/[?!.,]/g, "").slice(0, 20)}...`,
    ];
    setResult({ score: Math.min(100, Math.max(0, score)), flags, tips, alternatives });
  }, [subject, audience]);

  return (
    <ToolShell title="Email Subject Line Tester" description="Get a score, spam flags, and improvement suggestions before you hit send.">
      <div className="space-y-4 mb-5">
        <TextInput id="subject" label="Your Subject Line" value={subject} onChange={setSubject} placeholder="e.g. The one strategy doubling our clients' leads this quarter" />
        <SelectInput id="audience" label="Audience Type" value={audience} onChange={setAudience}
          options={[{ label: "B2B (Business)", value: "b2b" }, { label: "B2C (Consumer)", value: "b2c" }]}
        />
      </div>
      <RunButton onClick={analyse} label="Analyse Subject Line" />
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-black ${result.score >= 70 ? "text-green-600" : result.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
              {result.score}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {result.score >= 70 ? "Good subject line" : result.score >= 50 ? "Needs improvement" : "High risk — rework before sending"}
              </p>
              <p className="text-xs text-slate-500">{subject.length} characters · {subject.split(" ").length} words</p>
            </div>
          </div>
          {result.flags.length > 0 && (
            <div className="space-y-1.5">
              {result.flags.map((f, i) => <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700"><span>⚠️</span>{f}</div>)}
            </div>
          )}
          {result.tips.length > 0 && (
            <div className="space-y-1.5">
              {result.tips.map((t, i) => <div key={i} className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-2.5">{t}</div>)}
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Alternative Variants</p>
            {result.alternatives.map((alt, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg mb-1.5">
                <span className="text-sm text-slate-800">{alt}</span>
                <CopyButton text={alt} />
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Conversion Rate Calculator ─────────────────────────────────────────────────
function ConversionRateCalculator() {
  const [visitors, setVisitors] = useState("");
  const [conversions, setConversions] = useState("");
  const [convValue, setConvValue] = useState("");
  const [result, setResult] = useState<null | { cvr: number; revenue: number; revenueAt1: number; revenueAt2: number }>(null);

  const calculate = useCallback(() => {
    const v = Number(visitors) || 1;
    const c = Number(conversions) || 0;
    const val = Number(convValue) || 0;
    const cvr = (c / v) * 100;
    const revenue = c * val;
    const revenueAt1 = Math.round(v * 0.01) * val;
    const revenueAt2 = Math.round(v * 0.02) * val;
    setResult({ cvr, revenue, revenueAt1, revenueAt2 });
  }, [visitors, conversions, convValue]);

  return (
    <ToolShell title="Conversion Rate Calculator" description="Calculate your CVR and project the revenue impact of CRO improvements.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <NumberInput id="visitors" label="Monthly Visitors" value={visitors} onChange={setVisitors} min={1} placeholder="e.g. 5000" />
        <NumberInput id="conversions" label="Monthly Conversions" value={conversions} onChange={setConversions} min={0} placeholder="e.g. 75" />
        <NumberInput id="value" label="Value Per Conversion (AED)" value={convValue} onChange={setConvValue} unit="AED" placeholder="e.g. 1000" />
      </div>
      <RunButton onClick={calculate} />
      {result && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <ResultCard label="Conversion Rate" value={`${fmt(result.cvr, 2)}%`} highlight />
            <ResultCard label="Monthly Revenue" value={`AED ${fmtInt(result.revenue)}`} />
            <ResultCard label="Industry avg" value="2–5%" note="Compare your rate against your sector" />
          </div>
          {result.revenueAt1 > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 mb-2">CRO Impact Model</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p>At <strong>1% CVR</strong>: AED {fmtInt(result.revenueAt1)}/mo</p>
                <p>At <strong>2% CVR</strong>: AED {fmtInt(result.revenueAt2)}/mo</p>
                <p className="text-xs text-slate-400 mt-2">Improving CVR delivers the same revenue as more traffic — without the additional ad spend.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}


// ── Cost Per Lead Calculator ───────────────────────────────────────────────────
function CostPerLeadCalculator() {
  const [spend, setSpend] = useState("");
  const [leads, setLeads] = useState("");
  const [closeRate, setCloseRate] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [result, setResult] = useState<null | { cpl: number; cpa: number; revenue: number; roi: number }>(null);

  const calculate = useCallback(() => {
    const s = Number(spend) || 0;
    const l = Number(leads) || 1;
    const cr = Number(closeRate) / 100;
    const dv = Number(dealValue) || 0;
    const cpl = s / l;
    const customers = Math.round(l * cr);
    const cpa = cr > 0 ? cpl / cr : 0;
    const revenue = customers * dv;
    const roi = s > 0 ? ((revenue - s) / s) * 100 : 0;
    setResult({ cpl, cpa, revenue, roi });
  }, [spend, leads, closeRate, dealValue]);

  return (
    <ToolShell title="Cost Per Lead Calculator" description="Calculate CPL, cost per acquisition, and revenue ROI from your marketing spend.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="spend" label="Monthly Marketing Spend (AED)" value={spend} onChange={setSpend} unit="AED" placeholder="e.g. 15000" />
        <NumberInput id="leads" label="Leads Generated" value={leads} onChange={setLeads} min={1} placeholder="e.g. 45" />
        <NumberInput id="close" label="Lead-to-Customer Close Rate" value={closeRate} onChange={setCloseRate} unit="%" placeholder="e.g. 20" />
        <NumberInput id="deal" label="Average Deal Value (AED)" value={dealValue} onChange={setDealValue} unit="AED" placeholder="e.g. 8000" />
      </div>
      <RunButton onClick={calculate} />
      {result && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultCard label="Cost Per Lead" value={`AED ${fmt(result.cpl)}`} highlight />
          <ResultCard label="Cost Per Acquisition" value={`AED ${fmt(result.cpa)}`} />
          <ResultCard label="Revenue Generated" value={`AED ${fmtInt(result.revenue)}`} />
          <ResultCard label="Marketing ROI" value={`${fmt(result.roi, 0)}%`} note={result.roi > 0 ? "✓ Positive ROI" : "⚠ Negative ROI"} />
        </div>
      )}
    </ToolShell>
  );
}

// ── Core Web Vitals Checklist ─────────────────────────────────────────────────
const CWV_CHECKLIST = [
  {
    section: "LCP — Largest Contentful Paint (target: < 2.5s)",
    items: [
      "Enable server-side rendering or static generation for above-fold content",
      "Preload LCP image with <link rel='preload'>",
      "Use a CDN to serve images from a location close to the user",
      "Compress images (WebP/AVIF format, 80% quality)",
      "Specify width and height attributes on LCP image to prevent layout shifts",
      "Remove render-blocking JS/CSS above the fold",
      "Enable HTTP/2 on your server",
      "Use efficient cache headers (Cache-Control: max-age=31536000 for static assets)",
      "Defer non-critical JavaScript with defer or async",
      "Audit server response time (target TTFB < 0.8s)",
    ],
  },
  {
    section: "INP — Interaction to Next Paint (target: < 200ms)",
    items: [
      "Break up long JavaScript tasks (> 50ms) using scheduler.yield() or setTimeout",
      "Remove unnecessary third-party scripts (chat widgets, heavy analytics)",
      "Use web workers for CPU-intensive operations",
      "Lazy-load offscreen images and components",
      "Minimise DOM size (target < 1,500 nodes)",
      "Reduce JavaScript bundle size (tree-shake, code-split)",
      "Avoid forced synchronous layouts in JS (getBoundingClientRect in loops)",
      "Use passive event listeners for scroll and touch events",
    ],
  },
  {
    section: "CLS — Cumulative Layout Shift (target: < 0.1)",
    items: [
      "Set explicit width and height on all images and videos",
      "Reserve space for ad slots to prevent layout shift on load",
      "Add font-display: swap and set size-adjust for custom fonts",
      "Avoid inserting content above existing content after load",
      "Use CSS transforms instead of top/left/margin for animations",
      "Ensure dynamically injected content (banners, cookies) doesn't push layout",
      "Test with Chrome DevTools Layout Shift Regions to identify sources",
    ],
  },
  {
    section: "Monitoring & Verification",
    items: [
      "Set up Google Search Console Core Web Vitals monitoring",
      "Run Chrome User Experience Report (CrUX) for real-user data",
      "Audit with Google PageSpeed Insights (both Lab and Field data)",
      "Use Lighthouse CI to prevent CWV regressions in deployment",
      "Monitor CWV scores monthly and after major site updates",
      "Check CWV on both mobile and desktop separately",
      "Verify improvements with 28-day CrUX data (not just lab data)",
    ],
  },
];

function CoreWebVitalsChecklist() {
  const allItems = CWV_CHECKLIST.flatMap((s) => s.items.map((item) => `${s.section}::${item}`));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const pctDone = Math.round((checked.size / allItems.length) * 100);

  return (
    <ToolShell title="Core Web Vitals Checklist" description="Track your LCP, INP, and CLS optimisations as you implement them.">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">{checked.size} / {allItems.length} complete</p>
          <p className="text-sm font-bold text-blue-600">{pctDone}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${pctDone}%` }} />
        </div>
      </div>
      <div className="space-y-6">
        {CWV_CHECKLIST.map((section) => {
          const done = section.items.filter((i) => checked.has(`${section.section}::${i}`)).length;
          return (
            <div key={section.section}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{section.section}</h4>
                <span className="text-xs text-slate-400">{done}/{section.items.length}</span>
              </div>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const key = `${section.section}::${item}`;
                  const isDone = checked.has(key);
                  return (
                    <label key={key} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isDone ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100 hover:border-slate-200"}`}>
                      <input type="checkbox" checked={isDone} onChange={() => toggle(key)}
                        className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 mt-0.5 shrink-0"
                      />
                      <span className={`text-sm ${isDone ? "text-green-800 line-through" : "text-slate-700"}`}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}

// ── Mobile Readiness Checklist ─────────────────────────────────────────────────
const MOBILE_CHECKLIST = [
  {
    section: "Viewport & Layout",
    items: [
      "Viewport meta tag present: <meta name='viewport' content='width=device-width, initial-scale=1'>",
      "No horizontal scrolling on any page at 375px width",
      "All text readable without zooming (minimum 16px body font)",
      "No content wider than the viewport",
      "Tap targets ≥ 48×48px with ≥ 8px spacing between them",
    ],
  },
  {
    section: "Navigation & Forms",
    items: [
      "Mobile navigation menu is easy to open/close",
      "All form fields are usable on mobile with appropriate keyboard type (tel, email, number)",
      "Auto-zoom on form input fields disabled where appropriate",
      "CTAs are large enough to tap comfortably",
      "No interstitials blocking main content on mobile",
    ],
  },
  {
    section: "Speed & Performance",
    items: [
      "Mobile LCP < 2.5 seconds on simulated 4G",
      "Total page weight under 3MB on mobile",
      "Images are responsive (srcset) and sized appropriately for mobile",
      "No render-blocking resources above the fold",
      "Fonts load quickly with font-display: swap",
    ],
  },
  {
    section: "Content & Media",
    items: [
      "All images display correctly on retina/HiDPI mobile screens",
      "Videos are responsive (max-width: 100%) and don't autoplay with sound",
      "Tables have horizontal scroll or are reformatted for mobile",
      "PDF links open correctly on mobile or prompt download",
      "Social sharing buttons work on mobile browsers",
    ],
  },
  {
    section: "Mobile SEO",
    items: [
      "Google Mobile-Friendly Test passes",
      "Same content on mobile and desktop (required for mobile-first indexing)",
      "Structured data present on mobile version",
      "Canonical URLs consistent between mobile and desktop",
      "Click-to-call implemented for phone numbers",
      "Google Maps embed works on mobile",
      "No Flash or unsupported plugins used",
      "Favicon/app icon configured for home screen save",
    ],
  },
];

function MobileReadinessChecklist() {
  const allItems = MOBILE_CHECKLIST.flatMap((s) => s.items.map((item) => `${s.section}::${item}`));
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (key: string) => {
    setChecked((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };
  const pctDone = Math.round((checked.size / allItems.length) * 100);

  return (
    <ToolShell title="Mobile Readiness Checklist" description="Audit your website's mobile experience across 28 checkpoints.">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">{checked.size} / {allItems.length} complete</p>
          <p className="text-sm font-bold text-blue-600">{pctDone}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pctDone}%` }} />
        </div>
      </div>
      <div className="space-y-5">
        {MOBILE_CHECKLIST.map((section) => {
          const done = section.items.filter((i) => checked.has(`${section.section}::${i}`)).length;
          return (
            <div key={section.section}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800">{section.section}</h4>
                <span className="text-xs text-slate-400">{done}/{section.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const key = `${section.section}::${item}`;
                  const isDone = checked.has(key);
                  return (
                    <label key={key} className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${isDone ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100 hover:border-slate-200"}`}>
                      <input type="checkbox" checked={isDone} onChange={() => toggle(key)} className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 mt-0.5 shrink-0" />
                      <span className={`text-sm ${isDone ? "text-green-800 line-through" : "text-slate-700"}`}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}

// ── Marketing Budget Calculator ────────────────────────────────────────────────
const INDUSTRY_BUDGETS: Record<string, { pct: number; label: string }> = {
  ecommerce: { pct: 12, label: "E-commerce" },
  b2b_services: { pct: 6, label: "B2B Services" },
  b2c_services: { pct: 9, label: "B2C Services" },
  saas: { pct: 15, label: "SaaS / Technology" },
  real_estate: { pct: 5, label: "Real Estate" },
  healthcare: { pct: 7, label: "Healthcare" },
  hospitality: { pct: 10, label: "Hospitality" },
};

const CHANNEL_SPLITS: Record<string, Record<string, number>> = {
  awareness: { SEO: 20, "Google Ads": 15, "Social Media": 30, "Content Marketing": 20, "Email Marketing": 5, "Analytics & Tools": 10 },
  leads: { SEO: 25, "Google Ads": 35, "Social Media": 15, "Content Marketing": 15, "Email Marketing": 5, "Analytics & Tools": 5 },
  ecommerce: { SEO: 20, "Google Ads": 35, "Social Media": 25, "Content Marketing": 10, "Email Marketing": 7, "Analytics & Tools": 3 },
  retention: { SEO: 10, "Google Ads": 10, "Social Media": 20, "Content Marketing": 25, "Email Marketing": 30, "Analytics & Tools": 5 },
};

function MarketingBudgetCalculator() {
  const [revenue, setRevenue] = useState("");
  const [industry, setIndustry] = useState("b2b_services");
  const [goal, setGoal] = useState("leads");
  const [result, setResult] = useState<null | { totalBudget: number; pct: number; channels: { name: string; amount: number; share: number }[] }>(null);

  const calculate = useCallback(() => {
    const rev = Number(revenue) || 0;
    const benchPct = INDUSTRY_BUDGETS[industry]?.pct ?? 8;
    const totalBudget = Math.round(rev * (benchPct / 100));
    const splits = CHANNEL_SPLITS[goal] ?? CHANNEL_SPLITS.leads;
    const channels = Object.entries(splits).map(([name, share]) => ({
      name, share, amount: Math.round(totalBudget * (share / 100)),
    }));
    setResult({ totalBudget, pct: benchPct, channels });
  }, [revenue, industry, goal]);

  return (
    <ToolShell title="Marketing Budget Calculator" description="Get a recommended marketing budget and channel allocation for your business.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="revenue" label="Monthly Revenue (AED)" value={revenue} onChange={setRevenue} unit="AED" placeholder="e.g. 200000" />
        <SelectInput id="industry" label="Industry" value={industry} onChange={setIndustry}
          options={Object.entries(INDUSTRY_BUDGETS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        <div className="sm:col-span-2">
          <SelectInput id="goal" label="Primary Marketing Goal" value={goal} onChange={setGoal}
            options={[
              { label: "Lead Generation", value: "leads" },
              { label: "Brand Awareness", value: "awareness" },
              { label: "E-commerce Sales", value: "ecommerce" },
              { label: "Customer Retention", value: "retention" },
            ]}
          />
        </div>
      </div>
      <RunButton onClick={calculate} label="Calculate Budget" />
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Recommended Monthly Budget</p>
              <p className="text-3xl font-black text-blue-600">AED {fmtInt(result.totalBudget)}</p>
              <p className="text-sm text-slate-500 mt-0.5">{result.pct}% of monthly revenue — {INDUSTRY_BUDGETS[industry].label} benchmark</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {result.channels.map((ch) => (
              <div key={ch.name} className="flex items-center gap-3">
                <span className="text-sm text-slate-700 w-40 shrink-0">{ch.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${ch.share}%` }} />
                </div>
                <div className="text-right shrink-0 w-28">
                  <span className="text-sm font-semibold text-slate-900">AED {fmtInt(ch.amount)}</span>
                  <span className="text-xs text-slate-400 ml-1">({ch.share}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Marketing ROI Calculator ───────────────────────────────────────────────────
function MarketingRoiCalculator() {
  const [investment, setInvestment] = useState("");
  const [revenue, setRevenue] = useState("");
  const [margin, setMargin] = useState("50");
  const [result, setResult] = useState<null | { roi: number; multiplier: number; profit: number }>(null);

  const calculate = useCallback(() => {
    const inv = Number(investment) || 0;
    const rev = Number(revenue) || 0;
    const m = Number(margin) / 100;
    const grossProfit = rev * m;
    const profit = grossProfit - inv;
    const roi = inv > 0 ? (profit / inv) * 100 : 0;
    const multiplier = inv > 0 ? rev / inv : 0;
    setResult({ roi, multiplier, profit });
  }, [investment, revenue, margin]);

  return (
    <ToolShell title="Marketing ROI Calculator" description="Calculate the true return on your total marketing investment.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <NumberInput id="inv" label="Total Marketing Investment (AED)" value={investment} onChange={setInvestment} unit="AED" placeholder="e.g. 30000" />
        <NumberInput id="rev" label="Attributed Revenue (AED)" value={revenue} onChange={setRevenue} unit="AED" placeholder="e.g. 150000" />
        <NumberInput id="margin" label="Gross Margin" value={margin} onChange={setMargin} unit="%" min={1} max={100} placeholder="50" />
      </div>
      <RunButton onClick={calculate} />
      {result && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultCard label="Marketing ROI" value={`${fmt(result.roi, 0)}%`} highlight />
          <ResultCard label="Revenue Multiplier" value={`${fmt(result.multiplier, 1)}×`} note={result.multiplier >= 5 ? "✓ Strong performance" : result.multiplier >= 3 ? "✓ Healthy" : "⚠ Needs improvement"} />
          <ResultCard label="Net Profit" value={`AED ${fmtInt(result.profit)}`} note={result.profit > 0 ? "✓ Profitable" : "⚠ Negative"} />
        </div>
      )}
    </ToolShell>
  );
}

// ── Customer Lifetime Value Calculator ─────────────────────────────────────────
function ClvCalculator() {
  const [avgOrder, setAvgOrder] = useState("");
  const [frequency, setFrequency] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [margin, setMargin] = useState("50");
  const [result, setResult] = useState<null | { clv: number; profitClv: number; maxCac: number; ratio3: number }>(null);

  const calculate = useCallback(() => {
    const o = Number(avgOrder) || 0;
    const f = Number(frequency) || 0;
    const l = Number(lifespan) || 0;
    const m = Number(margin) / 100;
    const clv = o * f * l;
    const profitClv = clv * m;
    const maxCac = profitClv / 3;
    const ratio3 = maxCac;
    setResult({ clv, profitClv, maxCac, ratio3 });
  }, [avgOrder, frequency, lifespan, margin]);

  return (
    <ToolShell title="Customer Lifetime Value Calculator" description="Know exactly how much each customer is worth — and how much to spend acquiring them.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="order" label="Average Order Value (AED)" value={avgOrder} onChange={setAvgOrder} unit="AED" placeholder="e.g. 5000" />
        <NumberInput id="freq" label="Purchases Per Year" value={frequency} onChange={setFrequency} min={0.1} step={0.5} placeholder="e.g. 2" />
        <NumberInput id="life" label="Average Customer Lifespan (Years)" value={lifespan} onChange={setLifespan} min={0.1} step={0.5} placeholder="e.g. 3" />
        <NumberInput id="margin" label="Gross Profit Margin" value={margin} onChange={setMargin} unit="%" min={1} max={100} placeholder="50" />
      </div>
      <RunButton onClick={calculate} label="Calculate CLV" />
      {result && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <ResultCard label="Lifetime Revenue" value={`AED ${fmtInt(result.clv)}`} />
            <ResultCard label="Lifetime Profit" value={`AED ${fmtInt(result.profitClv)}`} highlight />
            <ResultCard label="Max CAC (3:1 ratio)" value={`AED ${fmtInt(result.maxCac)}`} note="Maximum acquisition cost" />
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-800">
              Each customer is worth <strong>AED {fmtInt(result.clv)}</strong> in revenue over their lifetime. At a healthy 3:1 LTV:CAC ratio, you can spend up to <strong>AED {fmtInt(result.maxCac)}</strong> to acquire each new customer and remain profitable.
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── AI Prompt Library (Reference) ─────────────────────────────────────────────
const AI_PROMPTS: { category: string; prompts: { title: string; prompt: string }[] }[] = [
  {
    category: "SEO",
    prompts: [
      { title: "Keyword research expansion", prompt: "Act as an SEO specialist. I am targeting the keyword '[PRIMARY KEYWORD]' for a [BUSINESS TYPE] in [LOCATION]. Generate a list of 20 related long-tail keywords grouped by search intent (informational, navigational, transactional). Include the likely monthly search volume range for each." },
      { title: "Meta title variations", prompt: "Write 10 meta title variations for a [PAGE TYPE] page targeting the keyword '[KEYWORD]' for [BRAND NAME]. Each title must be under 60 characters, include the keyword naturally, and be compelling enough to earn a click. Format as a numbered list." },
      { title: "Content gap analysis", prompt: "Act as an SEO content strategist. I am trying to rank for '[KEYWORD]'. The top 3 ranking pages cover [BRIEFLY DESCRIBE THEIR CONTENT]. What topics, questions, and angles are they missing that I could cover to differentiate my content and provide more value?" },
    ],
  },
  {
    category: "Google Ads",
    prompts: [
      { title: "RSA headlines", prompt: "Write 15 Google Ads headlines (max 30 characters each) for a Responsive Search Ad promoting [PRODUCT/SERVICE] to [TARGET AUDIENCE] in [LOCATION]. The primary keyword is '[KEYWORD]'. Include a mix of feature-focused, benefit-focused, and CTA-focused headlines." },
      { title: "Negative keyword list", prompt: "I am running Google Ads for [BUSINESS TYPE] offering [SERVICE]. Generate a comprehensive list of negative keywords to prevent irrelevant clicks. Consider: competitor-intent keywords, wrong-industry terms, DIY/free alternatives, job-seeker queries, and student research queries." },
      { title: "Ad copy test variants", prompt: "Write 3 completely different Google Ads for [PRODUCT/SERVICE]. Each should use a different copywriting angle: (1) problem-agitation-solution, (2) social proof and authority, (3) fear of missing out / urgency. Each ad needs 3 headlines (≤30 chars) and 2 descriptions (≤90 chars)." },
    ],
  },
  {
    category: "Social Media",
    prompts: [
      { title: "LinkedIn carousel script", prompt: "Create a 7-slide LinkedIn carousel script on the topic '[TOPIC]' for [TARGET AUDIENCE]. Slide 1: hook (one bold statement). Slides 2–6: one key insight per slide with a statistic or example. Slide 7: CTA and takeaway. Keep each slide to max 30 words. Include a suggested title for the cover slide." },
      { title: "Month of content ideas", prompt: "Generate 30 social media content ideas for [BUSINESS TYPE] targeting [AUDIENCE] on [PLATFORM]. Include a mix of: educational posts (40%), engagement posts (30%), and promotional posts (30%). Format as a content calendar with day number, post type, topic, and suggested caption hook." },
    ],
  },
  {
    category: "Email Marketing",
    prompts: [
      { title: "Welcome email sequence", prompt: "Write a 5-email welcome sequence for new subscribers of [BUSINESS/PRODUCT]. Email 1: warm welcome + set expectations. Email 2: most valuable content/resource. Email 3: social proof (case study or testimonial). Email 4: address the #1 objection. Email 5: soft CTA to [DESIRED ACTION]. Keep each email under 200 words." },
      { title: "Re-engagement campaign", prompt: "Write a 3-email re-engagement campaign for subscribers who haven't opened in 90 days. Business: [BUSINESS TYPE]. Email 1: Subject line hook + acknowledge the gap. Email 2: Your best content/offer. Email 3: Final 'break-up' email with an unsubscribe option. Include subject line options for each email." },
    ],
  },
  {
    category: "Content Strategy",
    prompts: [
      { title: "Blog post outline", prompt: "Create a detailed outline for a 2,000-word blog post targeting the keyword '[KEYWORD]' for [BUSINESS TYPE] targeting [AUDIENCE]. Include: a compelling H1 title, introduction hook, 5-6 H2 sections with 2-3 H3 sub-sections each, key points per section, a FAQ section (5 questions), and a conclusion with CTA." },
      { title: "Content repurposing plan", prompt: "I have published a [CONTENT TYPE: blog post/webinar/case study] about '[TOPIC]'. Create a repurposing plan to turn it into 8 different content pieces for different channels. For each piece, specify: format, platform, key angle, estimated production time, and which audience segment it targets." },
    ],
  },
];

function AiPromptLibrary() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <ToolShell title="AI Marketing Prompt Library" description="Professional AI prompts for ChatGPT, Claude, and Gemini. Click any prompt to copy and customise.">
      <div className="flex flex-wrap gap-2 mb-5">
        {AI_PROMPTS.map((cat, i) => (
          <button key={i} onClick={() => setActiveCategory(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === i ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {cat.category}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {AI_PROMPTS[activeCategory].prompts.map((p, i) => {
          const key = `${activeCategory}-${i}`;
          const isCopied = copiedIdx === key;
          return (
            <div key={key} className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-800">{p.title}</p>
                <button onClick={() => copy(p.prompt, key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isCopied ? "bg-green-100 text-green-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"}`}
                >
                  {isCopied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              <p className="px-4 py-3 text-sm text-slate-600 leading-relaxed font-mono bg-white">{p.prompt}</p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 mt-4">💡 Replace all [PLACEHOLDERS] in brackets before using. More specific context = better AI output.</p>
    </ToolShell>
  );
}

// ── AI Content Brief Generator ─────────────────────────────────────────────────
function AiContentBriefGenerator() {
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [goal, setGoal] = useState("rank");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(() => {
    if (!keyword.trim()) return;
    const k = keyword.trim();
    const a = audience.trim() || "marketing professionals";
    const typeLengths: Record<string, string> = {
      blog: "1,500–2,000 words", guide: "2,500–4,000 words", service: "800–1,200 words", landing: "600–1,000 words",
    };
    const goalText: Record<string, string> = {
      rank: "Rank on page 1 for the primary keyword", leads: "Generate qualified leads via contact form CTA", educate: "Educate the target audience and build authority", convert: "Convert warm prospects into paying clients",
    };
    const brief = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY KEYWORD: ${k}
CONTENT TYPE: ${contentType.replace(/_/g, " ")}
TARGET LENGTH: ${typeLengths[contentType] ?? "1,500–2,000 words"}
TONE: ${tone.charAt(0).toUpperCase() + tone.slice(1)}
PRIMARY GOAL: ${goalText[goal] ?? goal}

━━━ AUDIENCE ━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET READER: ${a}
KNOWLEDGE LEVEL: Intermediate (assume basic familiarity with ${k})
MAIN PAIN POINT: Not getting enough results from their current ${k} strategy
DESIRED OUTCOME: Clear, actionable steps to improve their ${k} performance

━━━ SUGGESTED TITLE OPTIONS ━━━━━━━━━━━━
1. The Complete Guide to ${k} for ${a} in 2025
2. How to Improve Your ${k} Results Without Spending More
3. ${k}: What Actually Works in the UAE Market
4. Why Your ${k} Isn't Working (And How to Fix It)

━━━ RECOMMENDED STRUCTURE ━━━━━━━━━━━━━━
H1: [Choose title above or write custom]

Introduction (150 words)
• Open with a compelling statistic or question about ${k}
• State what the reader will learn
• Include primary keyword in first 100 words

H2: What Is ${k} and Why Does It Matter?
• Definition in plain language
• Key benefits for ${a}
• Cost of NOT doing ${k}

H2: The Top ${k} Strategies That Work in 2025
• Strategy 1 (with example)
• Strategy 2 (with example)
• Strategy 3 (with example)

H2: How to Implement ${k} Step by Step
• Step 1: [Research/Audit]
• Step 2: [Setup/Planning]
• Step 3: [Execution]
• Step 4: [Measurement]

H2: Common ${k} Mistakes to Avoid
• Mistake 1 + how to avoid
• Mistake 2 + how to avoid
• Mistake 3 + how to avoid

H2: Frequently Asked Questions About ${k}
• 5 common questions from your target audience

Conclusion + CTA
• Summarise key takeaways
• Call to action: [Match to goal: ${goalText[goal]}]

━━━ SEO REQUIREMENTS ━━━━━━━━━━━━━━━━━━
• Include primary keyword in H1, first paragraph, and at least 2 H2s
• Use 3–5 semantic variations throughout
• Add schema markup: Article (blog) or Service (service pages)
• Target featured snippet with a clear H2 + concise paragraph answer
• Include 3–5 internal links to related pages

━━━ CONTENT NOTES ━━━━━━━━━━━━━━━━━━━━━
• Tone: ${tone} — avoid jargon, be specific with examples
• Include at least 1 original statistic or research citation
• Add a data table or comparison where applicable
• All claims must be accurate and up-to-date as of 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    setResult(brief);
  }, [keyword, audience, contentType, goal, tone]);

  return (
    <ToolShell title="AI Content Brief Generator" description="Generate a professional content brief ready for writers or AI tools.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextInput id="keyword" label="Primary Keyword" value={keyword} onChange={setKeyword} placeholder="e.g. Email Marketing Dubai" />
        <TextInput id="audience" label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. Dubai SME owners" />
        <SelectInput id="contentType" label="Content Type" value={contentType} onChange={setContentType}
          options={[
            { label: "Blog Post", value: "blog" },
            { label: "Long-form Guide", value: "guide" },
            { label: "Service Page", value: "service" },
            { label: "Landing Page", value: "landing" },
          ]}
        />
        <SelectInput id="goal" label="Primary Goal" value={goal} onChange={setGoal}
          options={[
            { label: "Rank for keyword", value: "rank" },
            { label: "Generate leads", value: "leads" },
            { label: "Educate audience", value: "educate" },
            { label: "Convert prospects", value: "convert" },
          ]}
        />
        <SelectInput id="tone" label="Tone" value={tone} onChange={setTone}
          options={[
            { label: "Professional", value: "professional" },
            { label: "Conversational", value: "conversational" },
            { label: "Bold / Direct", value: "bold" },
          ]}
        />
      </div>
      <RunButton onClick={generate} label="Generate Brief" />
      {result && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content Brief</p>
            <CopyButton text={result} />
          </div>
          <pre className="bg-slate-50 border border-slate-200 text-xs text-slate-700 p-4 rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}
    </ToolShell>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

// ─── Phase 14C Tool Implementations ──────────────────────────────────────────

// Shared share-link button
function ShareLinkBtn({ getParams }: { getParams: () => Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const share = () => {
    const p = new URLSearchParams(getParams());
    const url = `${window.location.origin}${window.location.pathname}?${p.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={share} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      {copied ? (
        <><svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Link Copied!</>
      ) : (
        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>Share Link</>
      )}
    </button>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4">{msg}</p>;
}

// ── SEO ROI Calculator ─────────────────────────────────────────────────────────
function SeoRoiCalculator() {
  const [traffic, setTraffic] = useState("");
  const [convRate, setConvRate] = useState("3");
  const [dealValue, setDealValue] = useState("");
  const [spend, setSpend] = useState("");
  const [growth, setGrowth] = useState("25");
  const [months, setMonths] = useState("12");
  const [result, setResult] = useState<null | {
    currentRevenue: number; projectedTraffic: number; projectedRevenue: number;
    revenueUplift: number; totalSpend: number; netProfit: number; roi: number; payback: number;
  }>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("srt")) setTraffic(p.get("srt")!);
    if (p.get("srcr")) setConvRate(p.get("srcr")!);
    if (p.get("srdv")) setDealValue(p.get("srdv")!);
    if (p.get("srsp")) setSpend(p.get("srsp")!);
    if (p.get("srg")) setGrowth(p.get("srg")!);
    if (p.get("srm")) setMonths(p.get("srm")!);
  }, []);

  const calculate = () => {
    const t = parseFloat(traffic), cr = parseFloat(convRate), dv = parseFloat(dealValue);
    const sp = parseFloat(spend), gr = parseFloat(growth), mo = parseFloat(months);
    if ([t, cr, dv, sp].some((n) => isNaN(n) || n <= 0)) {
      setError("Please enter valid positive numbers for all required fields."); return;
    }
    setError("");
    const currentRevenue = t * (cr / 100) * dv;
    const growthFactor = Math.pow(1 + gr / 100, mo / 12);
    const projectedTraffic = t * growthFactor;
    const projectedRevenue = projectedTraffic * (cr / 100) * dv;
    const revenueUplift = projectedRevenue - currentRevenue;
    const totalSpend = sp * mo;
    const netProfit = revenueUplift - totalSpend;
    const roi = totalSpend > 0 ? (netProfit / totalSpend) * 100 : 0;
    const payback = revenueUplift > 0 ? (totalSpend / (revenueUplift / mo)) : 0;
    setResult({ currentRevenue, projectedTraffic, projectedRevenue, revenueUplift, totalSpend, netProfit, roi, payback });
  };

  const reset = () => { setTraffic(""); setConvRate("3"); setDealValue(""); setSpend(""); setGrowth("25"); setMonths("12"); setResult(null); setError(""); };

  return (
    <ToolShell title="SEO ROI Calculator" description="Project the revenue return on your SEO investment over 6, 12, or 24 months.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="srt" label="Monthly Organic Visitors" value={traffic} onChange={setTraffic} min={0} placeholder="e.g. 5000" />
        <NumberInput id="srcr" label="Organic Conversion Rate" value={convRate} onChange={setConvRate} min={0} max={100} step={0.1} unit="%" placeholder="e.g. 3" />
        <NumberInput id="srdv" label="Average Deal Value (AED)" value={dealValue} onChange={setDealValue} min={0} unit="AED" placeholder="e.g. 5000" />
        <NumberInput id="srsp" label="Monthly SEO Spend (AED)" value={spend} onChange={setSpend} min={0} unit="AED" placeholder="e.g. 5000" />
        <SelectInput id="srg" label="Annual Traffic Growth Target" value={growth} onChange={setGrowth} options={[
          { label: "Conservative — 15%/yr", value: "15" },
          { label: "Realistic — 25%/yr", value: "25" },
          { label: "Aggressive — 50%/yr", value: "50" },
          { label: "High-growth — 100%/yr", value: "100" },
        ]} />
        <SelectInput id="srm" label="Time Horizon" value={months} onChange={setMonths} options={[
          { label: "6 months", value: "6" },
          { label: "12 months", value: "12" },
          { label: "24 months", value: "24" },
        ]} />
      </div>
      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={calculate} label="Calculate ROI" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
        <ShareLinkBtn getParams={() => ({ srt: traffic, srcr: convRate, srdv: dealValue, srsp: spend, srg: growth, srm: months })} />
      </div>
      {result && (
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label={`Revenue at ${months}m`} value={`AED ${fmtInt(result.projectedRevenue)}`} highlight />
            <ResultCard label="Revenue Uplift" value={`AED ${fmtInt(result.revenueUplift)}`} note={`vs AED ${fmtInt(result.currentRevenue)}/mo today`} />
            <ResultCard label="Total SEO Spend" value={`AED ${fmtInt(result.totalSpend)}`} note={`${months} months × AED ${fmtInt(parseFloat(spend))}`} />
            <ResultCard label="Net Profit" value={`AED ${fmtInt(result.netProfit)}`} note={result.netProfit >= 0 ? "✓ Profitable" : "Not yet profitable"} />
            <ResultCard label="SEO ROI" value={`${result.roi >= 0 ? "+" : ""}${fmt(result.roi, 0)}%`} note="Return on investment" />
            <ResultCard label="Projected Traffic" value={fmtInt(result.projectedTraffic)} note={`From ${fmtInt(parseFloat(traffic) || 0)}/mo`} />
          </div>
          <div className={`p-4 rounded-xl border ${result.roi >= 0 ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
            <p className={`text-xs font-semibold mb-1 ${result.roi >= 0 ? "text-blue-700" : "text-amber-700"}`}>Interpretation</p>
            <p className={`text-sm leading-relaxed ${result.roi >= 0 ? "text-blue-900" : "text-amber-900"}`}>
              {result.roi >= 200
                ? `Excellent ROI of ${fmt(result.roi, 0)}%. Your SEO campaign significantly outperforms the 100–200% benchmark. Scale investment to maximise compounding growth.`
                : result.roi >= 0
                ? `Positive ROI of ${fmt(result.roi, 0)}%. Your campaign is on track. Increasing content output or targeting higher-value keywords can accelerate returns.`
                : `Organic SEO compounds — most campaigns hit positive ROI between months 8–14. Extending to 24 months typically shows a very different picture. Consider whether your growth target is achievable given your domain authority and content plan.`}
            </p>
          </div>
          {result.payback > 0 && result.payback <= parseFloat(months) && (
            <p className="text-xs text-slate-500 text-center">Estimated payback period: <strong className="text-slate-700">{fmt(result.payback, 1)} months</strong></p>
          )}
        </div>
      )}
    </ToolShell>
  );
}

// ── Website Cost Calculator ────────────────────────────────────────────────────
type FeatureKey = "blog" | "booking" | "payment" | "chat" | "crm" | "multilingual";

const SITE_BASE: Record<string, { low: number; high: number; timeline: string }> = {
  brochure:  { low: 3000,  high: 10000,  timeline: "2–4 weeks" },
  service:   { low: 12000, high: 40000,  timeline: "4–8 weeks" },
  ecommerce: { low: 35000, high: 120000, timeline: "8–16 weeks" },
  saas:      { low: 80000, high: 300000, timeline: "16–36 weeks" },
};
const PAGE_MULT: Record<string, number> = { "5-10": 1, "10-20": 1.3, "20-50": 1.7, "50+": 2.2 };
const DESIGN_MULT: Record<string, number> = { template: 0.75, semicustom: 1.0, custom: 1.65 };
const CMS_MULT: Record<string, number> = { wordpress: 1.0, shopify: 1.1, webflow: 0.95, custom: 1.55 };
const FEATURE_ADD: Record<FeatureKey, { low: number; high: number; monthly: number; label: string }> = {
  blog:         { low: 1500,  high: 4000,  monthly: 0,    label: "Blog / Content Hub" },
  booking:      { low: 4000,  high: 14000, monthly: 200,  label: "Booking / Scheduling System" },
  payment:      { low: 3000,  high: 9000,  monthly: 150,  label: "Payment Gateway Integration" },
  chat:         { low: 800,   high: 2500,  monthly: 100,  label: "Live Chat / WhatsApp Widget" },
  crm:          { low: 4500,  high: 14000, monthly: 0,    label: "CRM Integration" },
  multilingual: { low: 5000,  high: 20000, monthly: 0,    label: "Multilingual / Arabic Support" },
};

function WebsiteCostCalculator() {
  const [siteType, setSiteType] = useState("service");
  const [pageCount, setPageCount] = useState("10-20");
  const [designLevel, setDesignLevel] = useState("semicustom");
  const [cms, setCms] = useState("wordpress");
  const [features, setFeatures] = useState<FeatureKey[]>([]);
  const [result, setResult] = useState<null | {
    low: number; high: number; timeline: string; monthlyMin: number; monthlyMax: number;
  }>(null);

  const toggleFeature = (f: FeatureKey) =>
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const calculate = () => {
    const base = SITE_BASE[siteType];
    const pm = PAGE_MULT[pageCount] ?? 1;
    const dm = DESIGN_MULT[designLevel] ?? 1;
    const cm = CMS_MULT[cms] ?? 1;
    let low = base.low * pm * dm * cm;
    let high = base.high * pm * dm * cm;
    let monthlyMin = 500; // base hosting/maintenance
    let monthlyMax = 2000;
    features.forEach((f) => {
      const add = FEATURE_ADD[f];
      low += add.low;
      high += add.high;
      monthlyMin += add.monthly;
      monthlyMax += add.monthly * 1.5;
    });
    setResult({ low: Math.round(low), high: Math.round(high), timeline: base.timeline, monthlyMin: Math.round(monthlyMin), monthlyMax: Math.round(monthlyMax) });
  };

  const reset = () => { setSiteType("service"); setPageCount("10-20"); setDesignLevel("semicustom"); setCms("wordpress"); setFeatures([]); setResult(null); };

  return (
    <ToolShell title="Website Cost Calculator" description="Estimate your development budget and timeline before briefing an agency.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <SelectInput id="wct" label="Website Type" value={siteType} onChange={setSiteType} options={[
          { label: "Brochure / Landing Page", value: "brochure" },
          { label: "Service Business Site", value: "service" },
          { label: "E-commerce Store", value: "ecommerce" },
          { label: "SaaS / Web Application", value: "saas" },
        ]} />
        <SelectInput id="wcp" label="Number of Pages" value={pageCount} onChange={setPageCount} options={[
          { label: "5–10 pages", value: "5-10" },
          { label: "10–20 pages", value: "10-20" },
          { label: "20–50 pages", value: "20-50" },
          { label: "50+ pages", value: "50+" },
        ]} />
        <SelectInput id="wcd" label="Design Approach" value={designLevel} onChange={setDesignLevel} options={[
          { label: "Premium Template (fastest, lowest cost)", value: "template" },
          { label: "Semi-Custom (template + customisation)", value: "semicustom" },
          { label: "Fully Custom (bespoke design)", value: "custom" },
        ]} />
        <SelectInput id="wcc" label="CMS / Platform" value={cms} onChange={setCms} options={[
          { label: "WordPress (recommended for most)", value: "wordpress" },
          { label: "Shopify (best for e-commerce)", value: "shopify" },
          { label: "Webflow (design-first)", value: "webflow" },
          { label: "Custom Build", value: "custom" },
        ]} />
      </div>
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-700 mb-3">Additional Features</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(FEATURE_ADD) as FeatureKey[]).map((f) => (
            <label key={f} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${features.includes(f) ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <input type="checkbox" className="sr-only" checked={features.includes(f)} onChange={() => toggleFeature(f)} />
              <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${features.includes(f) ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                {features.includes(f) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{FEATURE_ADD[f].label}</p>
                <p className="text-xs text-slate-400">+AED {(FEATURE_ADD[f].low / 1000).toFixed(0)}k–{(FEATURE_ADD[f].high / 1000).toFixed(0)}k</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={calculate} label="Estimate Cost" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
      </div>
      {result && (
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Est. Development Cost (Low)" value={`AED ${fmtInt(result.low)}`} />
            <ResultCard label="Est. Development Cost (High)" value={`AED ${fmtInt(result.high)}`} highlight />
            <ResultCard label="Build Timeline" value={result.timeline} note="Typical agency timeline" />
            <ResultCard label="Est. Monthly Costs" value={`AED ${fmtInt(result.monthlyMin)}–${fmtInt(result.monthlyMax)}`} note="Hosting, support & tools" />
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-700 mb-2">What this estimate includes</p>
            <p className="text-sm text-slate-600 leading-relaxed">Design & development for {pageCount} pages on {cms.charAt(0).toUpperCase() + cms.slice(1)} with a {designLevel === "semicustom" ? "semi-custom" : designLevel} approach.{features.length > 0 ? ` Includes: ${features.map((f) => FEATURE_ADD[f].label).join(", ")}.` : ""}</p>
            <p className="text-xs text-slate-400 mt-2">Note: Content creation, photography, SEO setup, and training are not included. Budget an additional 20–30% for these ancillary costs.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyButton text={`Website Cost Estimate:\nDevelopment: AED ${fmtInt(result.low)}–${fmtInt(result.high)}\nTimeline: ${result.timeline}\nMonthly costs: AED ${fmtInt(result.monthlyMin)}–${fmtInt(result.monthlyMax)}/mo\nFeatures: ${features.length > 0 ? features.map((f) => FEATURE_ADD[f].label).join(", ") : "None"}`} />
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── UTM Builder ────────────────────────────────────────────────────────────────
const UTM_SOURCE_PRESETS = [
  { label: "Google", value: "google" },
  { label: "Facebook", value: "facebook" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Instagram", value: "instagram" },
  { label: "Email", value: "email" },
  { label: "YouTube", value: "youtube" },
];
const UTM_MEDIUM_PRESETS = [
  { label: "CPC", value: "cpc" },
  { label: "Email", value: "email" },
  { label: "Social", value: "organic-social" },
  { label: "Display", value: "display" },
  { label: "Video", value: "video" },
  { label: "Referral", value: "referral" },
];

function UtmBuilder() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [utmUrl, setUtmUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("uurl")) setUrl(p.get("uurl")!);
    if (p.get("usrc")) setSource(p.get("usrc")!);
    if (p.get("umed")) setMedium(p.get("umed")!);
    if (p.get("ucmp")) setCampaign(p.get("ucmp")!);
    if (p.get("utrm")) setTerm(p.get("utrm")!);
    if (p.get("ucnt")) setContent(p.get("ucnt")!);
  }, []);

  const build = () => {
    if (!url.trim() || !source.trim() || !medium.trim() || !campaign.trim()) {
      setError("URL, source, medium, and campaign name are required."); return;
    }
    let baseUrl = url.trim();
    if (!/^https?:\/\//i.test(baseUrl)) baseUrl = "https://" + baseUrl;
    try {
      const parsed = new URL(baseUrl);
      const params = new URLSearchParams(parsed.search);
      params.set("utm_source", source.trim().toLowerCase().replace(/\s+/g, "-"));
      params.set("utm_medium", medium.trim().toLowerCase().replace(/\s+/g, "-"));
      params.set("utm_campaign", campaign.trim().toLowerCase().replace(/\s+/g, "-"));
      if (term.trim()) params.set("utm_term", term.trim().toLowerCase().replace(/\s+/g, "+"));
      if (content.trim()) params.set("utm_content", content.trim().toLowerCase().replace(/\s+/g, "-"));
      parsed.search = params.toString();
      setUtmUrl(parsed.toString());
      setError("");
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com/page).");
    }
  };

  const reset = () => { setUrl(""); setSource(""); setMedium(""); setCampaign(""); setTerm(""); setContent(""); setUtmUrl(""); setError(""); };

  const copyUrl = () => {
    navigator.clipboard.writeText(utmUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareTool = () => {
    const p = new URLSearchParams({ uurl: url, usrc: source, umed: medium, ucmp: campaign, utrm: term, ucnt: content });
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${p}`).then(() => {
      setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const safeSource = source.trim().toLowerCase().replace(/\s+/g, "-") || "utm_source";
  const safeMedium = medium.trim().toLowerCase().replace(/\s+/g, "-") || "utm_medium";
  const safeCampaign = campaign.trim().toLowerCase().replace(/\s+/g, "-") || "utm_campaign";

  return (
    <ToolShell title="UTM Builder" description="Create properly formatted tracking URLs for every campaign. Use consistent naming to keep GA4 clean.">
      <div className="space-y-4 mb-5">
        <TextInput id="uurl" label="Destination URL *" value={url} onChange={setUrl} placeholder="https://eddietechsolns.com/services/seo" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Campaign Source *</Label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="google" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors mb-2" />
            <div className="flex flex-wrap gap-1.5">
              {UTM_SOURCE_PRESETS.map((p) => (
                <button key={p.value} onClick={() => setSource(p.value)} className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${source === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{p.label}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>Campaign Medium *</Label>
            <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="cpc" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors mb-2" />
            <div className="flex flex-wrap gap-1.5">
              {UTM_MEDIUM_PRESETS.map((p) => (
                <button key={p.value} onClick={() => setMedium(p.value)} className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${medium === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput id="ucmp" label="Campaign Name *" value={campaign} onChange={setCampaign} placeholder="spring-promo-2026" />
          <TextInput id="utrm" label="Campaign Term (optional)" value={term} onChange={setTerm} placeholder="seo+agency+dubai" />
          <TextInput id="ucnt" label="Campaign Content (optional)" value={content} onChange={setContent} placeholder="hero-banner-a" />
        </div>
      </div>
      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={build} label="Build Tracking URL" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
        <button onClick={shareTool} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          {linkCopied ? "✓ Saved!" : "Share Tool"}
        </button>
      </div>
      {utmUrl && (
        <div className="space-y-4 mt-2">
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Tracking URL</p>
              <button onClick={copyUrl} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${copied ? "bg-green-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {copied ? "✓ Copied!" : "Copy URL"}
              </button>
            </div>
            <p className="text-xs text-green-400 font-mono break-all leading-relaxed">{utmUrl}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 mb-3">UTM Parameter Breakdown</p>
            <div className="space-y-2">
              {[
                { param: "utm_source", value: safeSource, desc: "Where the traffic comes from" },
                { param: "utm_medium", value: safeMedium, desc: "The marketing channel" },
                { param: "utm_campaign", value: safeCampaign, desc: "The campaign initiative" },
                ...(term ? [{ param: "utm_term", value: term.toLowerCase().replace(/\s+/g, "+"), desc: "Keyword or targeting" }] : []),
                ...(content ? [{ param: "utm_content", value: content.toLowerCase().replace(/\s+/g, "-"), desc: "Ad variant or creative" }] : []),
              ].map(({ param, value, desc }) => (
                <div key={param} className="flex items-start gap-3 text-sm">
                  <code className="text-xs bg-white border border-slate-200 rounded px-2 py-0.5 text-blue-700 font-mono flex-shrink-0">{param}</code>
                  <span className="font-medium text-slate-800">{value}</span>
                  <span className="text-slate-400 text-xs">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700"><strong>GA4 Report Path:</strong> Reports → Acquisition → Traffic Acquisition → filter by <em>Session source / medium</em> → look for <strong>{safeSource} / {safeMedium}</strong></p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Meta Description Generator ─────────────────────────────────────────────────
function MetaDescriptionGenerator() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [usp, setUsp] = useState("");
  const [tone, setTone] = useState("persuasive");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("mdt")) setTopic(p.get("mdt")!);
    if (p.get("mdk")) setKeyword(p.get("mdk")!);
    if (p.get("mda")) setAudience(p.get("mda")!);
    if (p.get("mdu")) setUsp(p.get("mdu")!);
    if (p.get("mdtn")) setTone(p.get("mdtn")!);
  }, []);

  const generate = () => {
    if (!topic.trim() || !keyword.trim()) {
      setError("Page topic and target keyword are required."); return;
    }
    setError("");
    const kw = keyword.trim();
    const kwLower = kw.charAt(0).toLowerCase() + kw.slice(1);
    const aud = audience.trim() || "businesses";
    const uspText = usp.trim() || "trusted by UAE businesses";
    const kwUpper = kw.charAt(0).toUpperCase() + kw.slice(1);

    const variants: string[] = [];
    if (tone === "persuasive" || tone === "all") {
      variants.push(`${kwUpper} for ${aud}. ${uspText}. Get expert help — free consultation, no commitment required.`);
      variants.push(`Looking for ${kwLower}? ${uspText}. Specialist team, measurable results. Start your ${topic.trim()} journey today.`);
      variants.push(`Expert ${kwLower} trusted by ${aud} across the UAE. ${uspText}. Contact us for a free strategy session.`);
    }
    if (tone === "informational" || tone === "all") {
      variants.push(`Learn everything about ${kwLower} for ${aud}. ${uspText}. Practical insights from UAE marketing specialists.`);
      variants.push(`${kwUpper} guide for ${aud}. Discover ${topic.trim()} strategies that work — backed by ${uspText}.`);
    }
    if (tone === "question" || tone === "all") {
      variants.push(`What is the best ${kwLower} for ${aud}? ${uspText}. Explore our approach and see real UAE client results.`);
      variants.push(`Need better ${kwLower} results? ${uspText}. Specialist ${topic.trim()} services for ${aud} — UAE-based team.`);
    }

    // Always produce exactly 3 unique variants
    const final = Array.from(new Set(variants)).slice(0, 3);
    while (final.length < 3) final.push(variants[final.length % variants.length] ?? "");
    setResults(final);
  };

  const reset = () => { setTopic(""); setKeyword(""); setAudience(""); setUsp(""); setTone("persuasive"); setResults([]); setError(""); };

  const getCharColor = (len: number) => len <= 155 && len >= 120 ? "text-green-600" : len > 155 ? "text-red-600" : "text-amber-600";
  const getCharBg = (len: number) => len <= 155 && len >= 120 ? "bg-green-50 border-green-200" : len > 155 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200";

  return (
    <ToolShell title="Meta Description Generator" description="Generate 3 ready-to-use meta descriptions optimised for click-through rate.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextInput id="mdt" label="Page Topic / Service *" value={topic} onChange={setTopic} placeholder="e.g. SEO Services Dubai" />
        <TextInput id="mdk" label="Target Keyword *" value={keyword} onChange={setKeyword} placeholder="e.g. SEO agency Dubai" />
        <TextInput id="mda" label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. SMEs in Dubai" />
        <TextInput id="mdu" label="Key USP / Differentiator" value={usp} onChange={setUsp} placeholder="e.g. 300+ first-page results delivered" />
        <SelectInput id="mdtn" label="Writing Tone" value={tone} onChange={setTone} options={[
          { label: "Persuasive (recommended)", value: "persuasive" },
          { label: "Informational / Educational", value: "informational" },
          { label: "Question-led", value: "question" },
        ]} />
      </div>
      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={generate} label="Generate Descriptions" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
        <button onClick={() => { const p = new URLSearchParams({ mdt: topic, mdk: keyword, mda: audience, mdu: usp, mdtn: tone }); navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${p}`).then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }); }} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          {linkCopied ? "✓ Link Copied!" : "Share Link"}
        </button>
      </div>
      {results.length > 0 && (
        <div className="space-y-3 mt-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">3 Optimised Variants</p>
          {results.map((desc, i) => {
            const len = desc.length;
            return (
              <div key={i} className={`border rounded-xl p-4 ${getCharBg(len)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Variant {i + 1}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${getCharColor(len)}`}>{len} chars {len <= 155 && len >= 120 ? "✓" : len > 155 ? "(too long)" : "(too short)"}</span>
                    <CopyButton text={desc} />
                  </div>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{desc}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${keyword && desc.toLowerCase().includes(keyword.toLowerCase()) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {keyword && desc.toLowerCase().includes(keyword.toLowerCase()) ? "✓ Keyword included" : "⚠ Keyword missing"}
                  </span>
                  <span className="text-xs text-slate-400">{len >= 120 && len <= 155 ? "Ideal length" : len > 155 ? "Will truncate in SERP" : "Consider expanding"}</span>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-slate-400 pt-1">Tip: Google rewrites ~70% of meta descriptions. Keeping yours specific, keyword-rich, and under 155 chars maximises the chance Google uses your version.</p>
        </div>
      )}
    </ToolShell>
  );
}

// ── Schema Generator ───────────────────────────────────────────────────────────
type SchemaType = "Organisation" | "LocalBusiness" | "FAQ" | "Article" | "Service";

function SchemaGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("LocalBusiness");
  // Organisation / LocalBusiness fields
  const [orgName, setOrgName] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgCity, setOrgCity] = useState("Dubai");
  const [orgHours, setOrgHours] = useState("Mo-Fr 09:00-18:00");
  // FAQ fields
  const [faqQ1, setFaqQ1] = useState(""); const [faqA1, setFaqA1] = useState("");
  const [faqQ2, setFaqQ2] = useState(""); const [faqA2, setFaqA2] = useState("");
  const [faqQ3, setFaqQ3] = useState(""); const [faqA3, setFaqA3] = useState("");
  // Article fields
  const [artTitle, setArtTitle] = useState(""); const [artAuthor, setArtAuthor] = useState("");
  const [artDate, setArtDate] = useState(""); const [artDesc, setArtDesc] = useState("");
  const [artImg, setArtImg] = useState(""); const [artUrl, setArtUrl] = useState("");
  // Service fields
  const [svcName, setSvcName] = useState(""); const [svcDesc, setSvcDesc] = useState("");
  const [svcArea, setSvcArea] = useState("Dubai, UAE"); const [svcUrl, setSvcUrl] = useState("");

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    let schema: Record<string, unknown> = {};

    if (schemaType === "Organisation") {
      if (!orgName || !orgUrl) { setError("Organisation name and URL are required."); return; }
      schema = {
        "@context": "https://schema.org", "@type": "Organisation",
        name: orgName, url: orgUrl,
        ...(orgPhone && { telephone: orgPhone }),
        ...(orgEmail && { email: orgEmail }),
        ...(orgDesc && { description: orgDesc }),
        address: { "@type": "PostalAddress", addressCountry: "AE" },
      };
    } else if (schemaType === "LocalBusiness") {
      if (!orgName || !orgPhone) { setError("Business name and phone are required."); return; }
      schema = {
        "@context": "https://schema.org", "@type": "LocalBusiness",
        name: orgName,
        ...(orgUrl && { url: orgUrl }),
        telephone: orgPhone,
        ...(orgEmail && { email: orgEmail }),
        ...(orgDesc && { description: orgDesc }),
        address: {
          "@type": "PostalAddress",
          ...(orgAddress && { streetAddress: orgAddress }),
          addressLocality: orgCity || "Dubai",
          addressCountry: "AE",
        },
        openingHours: orgHours || "Mo-Fr 09:00-18:00",
        currenciesAccepted: "AED",
        areaServed: { "@type": "City", name: orgCity || "Dubai" },
      };
    } else if (schemaType === "FAQ") {
      const questions = [
        { q: faqQ1, a: faqA1 }, { q: faqQ2, a: faqA2 }, { q: faqQ3, a: faqA3 },
      ].filter((item) => item.q && item.a);
      if (questions.length === 0) { setError("Add at least one question and answer."); return; }
      schema = {
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: questions.map(({ q, a }) => ({
          "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
        })),
      };
    } else if (schemaType === "Article") {
      if (!artTitle || !artUrl) { setError("Article title and URL are required."); return; }
      schema = {
        "@context": "https://schema.org", "@type": "Article",
        headline: artTitle,
        ...(artDesc && { description: artDesc }),
        ...(artAuthor && { author: { "@type": "Person", name: artAuthor } }),
        ...(artDate && { datePublished: artDate }),
        ...(artImg && { image: { "@type": "ImageObject", url: artImg } }),
        url: artUrl,
        publisher: { "@type": "Organisation", name: orgName || "Eddie Marketing Solutions" },
      };
    } else if (schemaType === "Service") {
      if (!svcName) { setError("Service name is required."); return; }
      schema = {
        "@context": "https://schema.org", "@type": "Service",
        name: svcName,
        ...(svcDesc && { description: svcDesc }),
        ...(svcArea && { areaServed: svcArea }),
        ...(svcUrl && { url: svcUrl }),
        provider: { "@type": "LocalBusiness", name: orgName || "Eddie Marketing Solutions" },
      };
    }

    setOutput(`<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`);
  };

  const reset = () => {
    setOrgName(""); setOrgUrl(""); setOrgPhone(""); setOrgEmail(""); setOrgDesc("");
    setOrgAddress(""); setOrgCity("Dubai"); setOrgHours("Mo-Fr 09:00-18:00");
    setFaqQ1(""); setFaqA1(""); setFaqQ2(""); setFaqA2(""); setFaqQ3(""); setFaqA3("");
    setArtTitle(""); setArtAuthor(""); setArtDate(""); setArtDesc(""); setArtImg(""); setArtUrl("");
    setSvcName(""); setSvcDesc(""); setSvcArea("Dubai, UAE"); setSvcUrl("");
    setOutput(""); setError("");
  };

  const richtResultsUrl = output ? `https://search.google.com/test/rich-results` : "";

  return (
    <ToolShell title="Schema Markup Generator" description="Generate JSON-LD structured data to unlock rich results in Google Search.">
      <div className="mb-5">
        <SelectInput id="sgt" label="Schema Type" value={schemaType} onChange={(v) => { setSchemaType(v as SchemaType); setOutput(""); setError(""); }} options={[
          { label: "LocalBusiness (recommended for most UAE businesses)", value: "LocalBusiness" },
          { label: "Organisation", value: "Organisation" },
          { label: "FAQ Page", value: "FAQ" },
          { label: "Article / Blog Post", value: "Article" },
          { label: "Service", value: "Service" },
        ]} />
      </div>

      {/* Shared name/url fields */}
      {(schemaType === "Organisation" || schemaType === "LocalBusiness" || schemaType === "Service") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <TextInput id="sgon" label={`${schemaType === "Service" ? "Provider " : ""}Business Name *`} value={orgName} onChange={setOrgName} placeholder="Eddie Marketing Solutions FZE" />
          <TextInput id="sgou" label="Website URL" value={orgUrl} onChange={setOrgUrl} placeholder="https://eddietechsolns.com" />
          <TextInput id="sgop" label={schemaType === "LocalBusiness" ? "Phone * (e.g. +971 4 123 4567)" : "Phone"} value={orgPhone} onChange={setOrgPhone} placeholder="+971 4 123 4567" />
          <TextInput id="sgoe" label="Email" value={orgEmail} onChange={setOrgEmail} placeholder="info@example.com" />
          {schemaType === "LocalBusiness" && <>
            <TextInput id="sgoa" label="Street Address" value={orgAddress} onChange={setOrgAddress} placeholder="Office 101, Business Bay" />
            <TextInput id="sgoc" label="City" value={orgCity} onChange={setOrgCity} placeholder="Dubai" />
            <TextInput id="sgoh" label="Opening Hours" value={orgHours} onChange={setOrgHours} placeholder="Mo-Fr 09:00-18:00" />
          </>}
          <TextInput id="sgod" label="Description" value={orgDesc} onChange={setOrgDesc} placeholder="Dubai-based digital marketing agency..." />
        </div>
      )}

      {schemaType === "FAQ" && (
        <div className="space-y-4 mb-4">
          {[[faqQ1, setFaqQ1, faqA1, setFaqA1, "1"], [faqQ2, setFaqQ2, faqA2, setFaqA2, "2"], [faqQ3, setFaqQ3, faqA3, setFaqA3, "3"]].map(([q, setQ, a, setA, n]) => (
            <div key={n as string} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <p className="text-xs font-semibold text-slate-500">Q&A Pair {n as string}</p>
              <TextInput id={`sgfq${n as string}`} label="Question" value={q as string} onChange={setQ as (v: string) => void} placeholder="What services do you offer?" />
              <TextInput id={`sgfa${n as string}`} label="Answer" value={a as string} onChange={setA as (v: string) => void} placeholder="We offer..." multiline />
            </div>
          ))}
        </div>
      )}

      {schemaType === "Article" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <TextInput id="sgatl" label="Article Title *" value={artTitle} onChange={setArtTitle} placeholder="The Complete Guide to SEO in Dubai" />
          <TextInput id="sgaau" label="Author Name" value={artAuthor} onChange={setArtAuthor} placeholder="Eddie Marketing Team" />
          <TextInput id="sgadt" label="Date Published (YYYY-MM-DD)" value={artDate} onChange={setArtDate} placeholder="2026-06-26" />
          <TextInput id="sgaim" label="Image URL" value={artImg} onChange={setArtImg} placeholder="https://example.com/image.jpg" />
          <TextInput id="sgaur" label="Article URL *" value={artUrl} onChange={setArtUrl} placeholder="https://example.com/blog/seo-guide" />
          <TextInput id="sgadc" label="Description" value={artDesc} onChange={setArtDesc} placeholder="A comprehensive guide to..." />
        </div>
      )}

      {schemaType === "Service" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <TextInput id="sgsvn" label="Service Name *" value={svcName} onChange={setSvcName} placeholder="SEO Services Dubai" />
          <TextInput id="sgsva" label="Area Served" value={svcArea} onChange={setSvcArea} placeholder="Dubai, Abu Dhabi, UAE" />
          <TextInput id="sgsvd" label="Service Description" value={svcDesc} onChange={setSvcDesc} placeholder="Professional SEO services for UAE businesses..." />
          <TextInput id="sgsvu" label="Service Page URL" value={svcUrl} onChange={setSvcUrl} placeholder="https://example.com/services/seo" />
        </div>
      )}

      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={generate} label="Generate Schema" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
      </div>

      {output && (
        <div className="space-y-3 mt-2">
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="text-xs font-semibold text-slate-400">JSON-LD — paste into your page &lt;head&gt;</p>
              <CopyButton text={output} />
            </div>
            <pre className="px-4 py-4 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{output}</pre>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-blue-900 flex-1">Validate your markup with Google&apos;s Rich Results Test before publishing.</p>
            <a href={richtResultsUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">Open Test →</a>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Open Graph Preview ─────────────────────────────────────────────────────────
function OpenGraphPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [ogType, setOgType] = useState("website");
  const [preview, setPreview] = useState(false);
  const [outputCode, setOutputCode] = useState("");
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("ogt")) setTitle(p.get("ogt")!);
    if (p.get("ogd")) setDescription(p.get("ogd")!);
    if (p.get("ogi")) setImageUrl(p.get("ogi")!);
    if (p.get("ogsn")) setSiteName(p.get("ogsn")!);
    if (p.get("ogu")) setPageUrl(p.get("ogu")!);
  }, []);

  const generate = () => {
    if (!title.trim()) { setError("Page title is required."); return; }
    setError("");
    const code = [
      `<!-- Primary Meta Tags -->`,
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      ``,
      `<!-- Open Graph / Facebook -->`,
      `<meta property="og:type" content="${ogType}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      ...(imageUrl ? [`<meta property="og:image" content="${imageUrl}" />`, `<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`] : []),
      ...(pageUrl ? [`<meta property="og:url" content="${pageUrl}" />`] : []),
      ...(siteName ? [`<meta property="og:site_name" content="${siteName}" />`] : []),
      ``,
      `<!-- Twitter / X Card -->`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      ...(imageUrl ? [`<meta name="twitter:image" content="${imageUrl}" />`] : []),
    ].join("\n");
    setOutputCode(code);
    setPreview(true);
  };

  const reset = () => { setTitle(""); setDescription(""); setImageUrl(""); setSiteName(""); setPageUrl(""); setOgType("website"); setPreview(false); setOutputCode(""); setError(""); };

  const shareLink = () => {
    const p = new URLSearchParams({ ogt: title, ogd: description, ogi: imageUrl, ogsn: siteName, ogu: pageUrl });
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${p}`).then(() => {
      setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const displayTitle = title || "Your Page Title";
  const displayDesc = description || "Your page description will appear here when shared on social media.";
  const displaySite = siteName || (pageUrl ? new URL("https://" + pageUrl.replace(/^https?:\/\//, "")).hostname : "yoursite.com");
  const titleLen = title.length;
  const descLen = description.length;

  return (
    <ToolShell title="Open Graph Preview" description="Preview and optimise how your pages look when shared on LinkedIn, Facebook, and Twitter/X.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="sm:col-span-2">
          <TextInput id="ogt" label="Page Title *" value={title} onChange={setTitle} placeholder="e.g. SEO Agency Dubai | Eddie Marketing Solutions" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">Recommended: 60–70 characters</span>
            <span className={`text-xs font-semibold ${titleLen <= 70 && titleLen > 0 ? "text-green-600" : titleLen > 70 ? "text-red-600" : "text-slate-400"}`}>{titleLen} chars</span>
          </div>
        </div>
        <div className="sm:col-span-2">
          <TextInput id="ogd" label="Page Description" value={description} onChange={setDescription} placeholder="e.g. Dubai's leading digital marketing agency. 300+ first-page results for UAE businesses." multiline />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">Recommended: 155–160 characters</span>
            <span className={`text-xs font-semibold ${descLen <= 160 && descLen >= 100 ? "text-green-600" : descLen > 160 ? "text-red-600" : "text-slate-400"}`}>{descLen} chars</span>
          </div>
        </div>
        <TextInput id="ogi" label="Image URL (1200×630px recommended)" value={imageUrl} onChange={setImageUrl} placeholder="https://yoursite.com/og-image.jpg" />
        <TextInput id="ogsn" label="Site Name" value={siteName} onChange={setSiteName} placeholder="Eddie Marketing Solutions" />
        <TextInput id="ogu" label="Page URL" value={pageUrl} onChange={setPageUrl} placeholder="https://eddietechsolns.com" />
        <SelectInput id="ogtp" label="OG Type" value={ogType} onChange={setOgType} options={[
          { label: "website (homepage, services)", value: "website" },
          { label: "article (blog posts)", value: "article" },
          { label: "product", value: "product" },
        ]} />
      </div>
      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={generate} label="Preview & Generate Tags" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
        <button onClick={shareLink} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          {linkCopied ? "✓ Copied!" : "Share Link"}
        </button>
      </div>

      {preview && (
        <div className="space-y-5 mt-2">
          {/* LinkedIn preview */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="inline-flex w-5 h-5 bg-[#0A66C2] rounded items-center justify-center text-white text-[9px] font-bold">in</span>
              LinkedIn Preview
            </p>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-w-md bg-white shadow-sm">
              {imageUrl ? (
                <div className="w-full h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="OG preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
              ) : (
                <div className="w-full h-36 bg-slate-100 flex items-center justify-center">
                  <p className="text-xs text-slate-400">No image — add an Image URL above</p>
                </div>
              )}
              <div className="p-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase mb-1">{displaySite}</p>
                <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{displayTitle}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{displayDesc}</p>
              </div>
            </div>
          </div>

          {/* Twitter/X preview */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="inline-flex w-5 h-5 bg-black rounded items-center justify-center text-white text-[9px] font-bold">𝕏</span>
              Twitter / X Preview
            </p>
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-w-sm bg-white shadow-sm relative">
              {imageUrl ? (
                <div className="w-full h-44 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Twitter preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
              ) : (
                <div className="w-full h-32 bg-slate-100 flex items-center justify-center">
                  <p className="text-xs text-slate-400">No image</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2.5">
                <p className="text-xs font-semibold text-white leading-snug line-clamp-1">{displayTitle}</p>
                <p className="text-xs text-white/70">{displaySite}</p>
              </div>
            </div>
          </div>

          {/* Meta tag output */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Generated Meta Tags — paste into &lt;head&gt;</p>
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <p className="text-xs text-slate-400">HTML meta tags</p>
                <CopyButton text={outputCode} />
              </div>
              <pre className="px-4 py-4 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{outputCode}</pre>
            </div>
          </div>

          {/* Checks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Title length", ok: titleLen > 0 && titleLen <= 70, text: titleLen <= 70 ? `${titleLen}/70 ✓` : `${titleLen}/70 — trim` },
              { label: "Description", ok: descLen >= 100 && descLen <= 160, text: descLen === 0 ? "Missing" : descLen > 160 ? "Too long" : "Good ✓" },
              { label: "OG Image", ok: !!imageUrl, text: imageUrl ? "Set ✓" : "Missing" },
              { label: "Site Name", ok: !!siteName, text: siteName ? "Set ✓" : "Not set" },
            ].map(({ label, ok, text }) => (
              <div key={label} className={`rounded-xl px-3 py-2.5 text-center border ${ok ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className={`text-xs font-semibold ${ok ? "text-green-700" : "text-amber-700"}`}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

// ── Business Growth Calculator ─────────────────────────────────────────────────
const INDUSTRY_BENCHMARKS: Record<string, { label: string; benchmark: number }> = {
  ecommerce:     { label: "E-commerce", benchmark: 25 },
  services:      { label: "Professional Services", benchmark: 20 },
  saas:          { label: "SaaS / Tech", benchmark: 35 },
  retail:        { label: "Retail", benchmark: 12 },
  healthcare:    { label: "Healthcare / Wellness", benchmark: 18 },
  education:     { label: "Education / Training", benchmark: 22 },
  other:         { label: "Other / General", benchmark: 20 },
};

function BusinessGrowthCalculator() {
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("25");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [horizon, setHorizon] = useState("12");
  const [industry, setIndustry] = useState("services");
  const [result, setResult] = useState<null | {
    endRevenue: number; totalAdditional: number; totalSpend: number; roi: number;
    cagr: number; benchmarkCagr: number; monthlyRows: { month: number; revenue: number; delta: number }[];
  }>(null);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("bgr")) setRevenue(p.get("bgr")!);
    if (p.get("bgg")) setGrowthRate(p.get("bgg")!);
    if (p.get("bgs")) setMonthlySpend(p.get("bgs")!);
    if (p.get("bgh")) setHorizon(p.get("bgh")!);
    if (p.get("bgi")) setIndustry(p.get("bgi")!);
  }, []);

  const calculate = () => {
    const rev = parseFloat(revenue);
    const gr = parseFloat(growthRate);
    const sp = parseFloat(monthlySpend) || 0;
    const mo = parseInt(horizon);
    if (isNaN(rev) || rev <= 0) { setError("Please enter a valid monthly revenue figure."); return; }
    setError("");

    const monthlyRows: { month: number; revenue: number; delta: number }[] = [];
    let totalAdditional = 0;
    for (let m = 1; m <= Math.min(mo, 12); m++) {
      const monthRev = rev * Math.pow(1 + gr / 100, m / 12);
      const delta = monthRev - rev;
      totalAdditional += delta;
      monthlyRows.push({ month: m, revenue: monthRev, delta });
    }
    // If horizon > 12, extrapolate the remaining months for the total
    if (mo > 12) {
      for (let m = 13; m <= mo; m++) {
        totalAdditional += rev * Math.pow(1 + gr / 100, m / 12) - rev;
      }
    }

    const endRevenue = rev * Math.pow(1 + gr / 100, mo / 12);
    const totalSpend = sp * mo;
    const roi = totalSpend > 0 ? ((totalAdditional - totalSpend) / totalSpend) * 100 : 0;
    const cagr = gr;
    const benchmarkCagr = INDUSTRY_BENCHMARKS[industry]?.benchmark ?? 20;

    setResult({ endRevenue, totalAdditional, totalSpend, roi, cagr, benchmarkCagr, monthlyRows });
  };

  const reset = () => { setRevenue(""); setGrowthRate("25"); setMonthlySpend(""); setHorizon("12"); setIndustry("services"); setResult(null); setError(""); };

  const shareLink = () => {
    const p = new URLSearchParams({ bgr: revenue, bgg: growthRate, bgs: monthlySpend, bgh: horizon, bgi: industry });
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${p}`).then(() => {
      setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
    <ToolShell title="Business Growth Calculator" description="Project revenue growth and measure the return on your marketing investment.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <NumberInput id="bgr" label="Current Monthly Revenue (AED)" value={revenue} onChange={setRevenue} min={0} unit="AED" placeholder="e.g. 100000" />
        <SelectInput id="bgg" label="Annual Growth Rate Target" value={growthRate} onChange={setGrowthRate} options={[
          { label: "Conservative — 10%/yr", value: "10" },
          { label: "Moderate — 15%/yr", value: "15" },
          { label: "Strong — 25%/yr", value: "25" },
          { label: "Aggressive — 40%/yr", value: "40" },
          { label: "High-Growth — 60%/yr", value: "60" },
          { label: "Hyper-Growth — 100%/yr", value: "100" },
        ]} />
        <NumberInput id="bgs" label="Monthly Marketing Investment (AED)" value={monthlySpend} onChange={setMonthlySpend} min={0} unit="AED" placeholder="e.g. 15000" />
        <SelectInput id="bgh" label="Forecast Horizon" value={horizon} onChange={setHorizon} options={[
          { label: "12 months (1 year)", value: "12" },
          { label: "24 months (2 years)", value: "24" },
          { label: "36 months (3 years)", value: "36" },
        ]} />
        <SelectInput id="bgi" label="Your Industry" value={industry} onChange={setIndustry} options={Object.entries(INDUSTRY_BENCHMARKS).map(([v, { label }]) => ({ value: v, label }))} />
      </div>
      <ErrMsg msg={error} />
      <div className="flex flex-wrap gap-3 mb-6">
        <RunButton onClick={calculate} label="Project Growth" />
        <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
        <button onClick={shareLink} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          {linkCopied ? "✓ Link Copied!" : "Share Link"}
        </button>
      </div>

      {result && (
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label={`Revenue at ${horizon} months`} value={`AED ${fmtInt(result.endRevenue)}`} highlight />
            <ResultCard label="Total Additional Revenue" value={`AED ${fmtInt(result.totalAdditional)}`} note="vs staying flat" />
            {result.totalSpend > 0 && <ResultCard label="Marketing Invested" value={`AED ${fmtInt(result.totalSpend)}`} />}
            {result.totalSpend > 0 && <ResultCard label="Marketing ROI" value={`${result.roi >= 0 ? "+" : ""}${fmt(result.roi, 0)}%`} note="Additional revenue vs spend" />}
          </div>

          {/* Benchmark */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${result.cagr >= result.benchmarkCagr ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex-1">
              <p className={`text-xs font-semibold mb-0.5 ${result.cagr >= result.benchmarkCagr ? "text-green-700" : "text-amber-700"}`}>Industry Benchmark Comparison</p>
              <p className={`text-sm ${result.cagr >= result.benchmarkCagr ? "text-green-900" : "text-amber-900"}`}>
                Your target: <strong>{growthRate}% CAGR</strong> · {INDUSTRY_BENCHMARKS[industry]?.label} benchmark: <strong>{result.benchmarkCagr}% CAGR</strong>
                {result.cagr >= result.benchmarkCagr ? " — above benchmark. Achievable with consistent marketing." : " — below benchmark. Review your marketing strategy to close the gap."}
              </p>
            </div>
          </div>

          {/* Monthly table */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Month-by-Month Revenue Projection (first {Math.min(parseInt(horizon), 12)} months)</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Month</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Projected Revenue</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Monthly Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyRows.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-600 font-medium">Month {row.month}</td>
                      <td className="px-4 py-2.5 text-right text-slate-900 font-semibold">AED {fmtInt(row.revenue)}</td>
                      <td className="px-4 py-2.5 text-right text-green-600 font-medium text-xs">+AED {fmtInt(row.delta)}</td>
                    </tr>
                  ))}
                  {parseInt(horizon) > 12 && (
                    <tr className="bg-blue-50">
                      <td className="px-4 py-2.5 text-blue-700 font-semibold">Month {horizon}</td>
                      <td className="px-4 py-2.5 text-right text-blue-900 font-bold">AED {fmtInt(result.endRevenue)}</td>
                      <td className="px-4 py-2.5 text-right text-blue-600 font-medium text-xs">Final target</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <CopyButton text={`Business Growth Projection:\nCurrent Revenue: AED ${fmtInt(parseFloat(revenue))}/mo\nTarget Growth: ${growthRate}%/yr\nAt ${horizon} months: AED ${fmtInt(result.endRevenue)}/mo\nTotal Additional Revenue: AED ${fmtInt(result.totalAdditional)}`} />
          </div>
        </div>
      )}
    </ToolShell>
  );
}

const TOOL_COMPONENTS: Record<string, () => React.ReactElement> = {
  "meta-title-generator": MetaTitleGenerator,
  "keyword-difficulty-estimator": KeywordDifficultyEstimator,
  "serp-ctr-calculator": SerpCTRCalculator,
  "robots-txt-generator": RobotsTxtGenerator,
  "seo-audit-checklist": SeoAuditChecklist,
  "google-ads-budget-calculator": GoogleAdsBudgetCalculator,
  "roas-calculator": RoasCalculator,
  "ad-copy-generator": AdCopyGenerator,
  "quality-score-guide": QualityScoreGuide,
  "engagement-rate-calculator": EngagementRateCalculator,
  "hashtag-generator": HashtagGenerator,
  "blog-title-generator": BlogTitleGenerator,
  "reading-time-calculator": ReadingTimeCalculator,
  "email-roi-calculator": EmailRoiCalculator,
  "email-subject-line-tester": EmailSubjectLineTester,
  "conversion-rate-calculator": ConversionRateCalculator,
  "cost-per-lead-calculator": CostPerLeadCalculator,
  "core-web-vitals-checklist": CoreWebVitalsChecklist,
  "mobile-readiness-checklist": MobileReadinessChecklist,
  "marketing-budget-calculator": MarketingBudgetCalculator,
  "marketing-roi-calculator": MarketingRoiCalculator,
  "customer-lifetime-value-calculator": ClvCalculator,
  "ai-marketing-prompt-library": AiPromptLibrary,
  "ai-content-brief-generator": AiContentBriefGenerator,
  // Phase 14C
  "seo-roi-calculator": SeoRoiCalculator,
  "website-cost-calculator": WebsiteCostCalculator,
  "utm-builder": UtmBuilder,
  "meta-description-generator": MetaDescriptionGenerator,
  "schema-generator": SchemaGenerator,
  "open-graph-preview": OpenGraphPreview,
  "business-growth-calculator": BusinessGrowthCalculator,
};

export default function ToolInteractive({ tool }: ToolInteractiveProps) {
  const Component = TOOL_COMPONENTS[tool.slug];

  if (!Component) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tool.iconEmoji}</span>
            <div>
              <p className="text-white font-semibold text-sm">{tool.name}</p>
              <p className="text-slate-400 text-xs">{tool.tagline}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-teal-500/15 text-teal-400 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/25">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            Coming Soon
          </span>
        </div>

        {/* Preview skeleton */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-3.5 bg-slate-100 rounded-full w-28 mb-2.5" />
                <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="h-12 bg-blue-600 rounded-xl opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-slate-500 text-sm font-medium">Calculate Results</span>
            </div>
          </div>

          {/* Divider + message */}
          <div className="mt-8 pt-7 border-t border-slate-100 text-center">
            <p className="text-slate-900 font-semibold text-base mb-1">
              This tool is in active development
            </p>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
              We&rsquo;re building the full interactive version of {tool.name}. In the meantime, our team can run this analysis for you manually — free of charge.
            </p>
            <a
              href="/request-for-a-proposal"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Get a Free Manual Analysis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Component />;
}
