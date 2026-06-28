interface Props {
  category: string;
}

function WebDesignIllustration() {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="bg-slate-700 px-4 py-2.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 mx-3 bg-slate-600 rounded-md text-xs text-slate-300 px-3 py-1 text-center">
          eddietechsolns.com
        </div>
      </div>
      <div className="bg-white p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="w-16 h-3 bg-blue-600 rounded" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-2 bg-slate-200 rounded" />
            <div className="w-7 h-2 bg-slate-200 rounded" />
            <div className="w-7 h-2 bg-slate-200 rounded" />
            <div className="w-16 h-5 bg-orange-500 rounded text-white text-[9px] flex items-center justify-center font-semibold">
              Get Quote
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 mb-3">
          <div className="w-3/4 h-3 bg-white/80 rounded mb-2" />
          <div className="w-1/2 h-2 bg-white/50 rounded mb-3" />
          <div className="flex items-center gap-2">
            <div className="w-20 h-6 bg-orange-500 rounded text-white text-[9px] flex items-center justify-center font-semibold">
              Get Started
            </div>
            <div className="w-16 h-6 border border-white/30 rounded text-white/60 text-[9px] flex items-center justify-center">
              Learn More
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { w: "w-12", color: "bg-blue-100" },
            { w: "w-10", color: "bg-orange-100" },
            { w: "w-14", color: "bg-green-100" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
              <div className={`h-5 ${item.color} rounded mb-1.5`} />
              <div className="w-full h-1.5 bg-slate-200 rounded mb-1" />
              <div className={`${item.w} h-1.5 bg-slate-200 rounded`} />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1">
          {["Mobile", "Tablet", "Desktop"].map((d) => (
            <div key={d} className="text-[9px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{d} ✓</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeoIllustration() {
  const results = [
    { rank: 1, label: "Your Business", highlight: true },
    { rank: 2, label: "Competitor A", highlight: false },
    { rank: 3, label: "Competitor B", highlight: false },
  ];
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <span className="text-xs text-slate-600">digital marketing agency dubai</span>
        <div className="ml-auto w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] text-slate-400">About 4,180,000 results</span>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-green-400 font-semibold">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
          Rankings up +18
        </div>
      </div>
      {results.map((r) => (
        <div key={r.rank} className={`p-3 rounded-lg ${r.highlight ? "bg-blue-600/20 border border-blue-500/40" : "bg-slate-700/60"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold w-4 ${r.highlight ? "text-green-400" : "text-slate-500"}`}>#{r.rank}</span>
            <span className={`text-xs font-medium ${r.highlight ? "text-blue-300" : "text-slate-400"}`}>{r.label}</span>
            {r.highlight && <span className="ml-auto text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full">↑ Position 1</span>}
          </div>
          <div className="ml-6">
            <div className={`h-1.5 rounded mb-1 ${r.highlight ? "w-4/5 bg-blue-400/50" : "w-3/5 bg-slate-600"}`} />
            <div className={`h-1.5 rounded ${r.highlight ? "w-3/5 bg-blue-400/30" : "w-2/5 bg-slate-600/60"}`} />
          </div>
        </div>
      ))}
      <div className="flex gap-3 px-1">
        {[{ label: "Domain Rating", val: "62", color: "text-blue-400" }, { label: "Keywords", val: "1,840", color: "text-orange-400" }].map((m) => (
          <div key={m.label} className="flex-1 bg-slate-700/80 rounded-lg p-2 text-center">
            <div className={`text-sm font-bold ${m.color}`}>{m.val}</div>
            <div className="text-[9px] text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoogleAdsIllustration() {
  const metrics = [
    { label: "CTR", value: "4.8%", change: "+1.2%", up: true },
    { label: "ROAS", value: "5.3x", change: "+0.8x", up: true },
    { label: "CPC", value: "AED 6.20", change: "-0.80", up: true },
    { label: "Conv.", value: "318", change: "+42", up: true },
  ];
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-xs font-semibold text-white">Campaign Performance</div>
          <div className="text-[10px] text-slate-400">Last 30 days · UAE Region</div>
        </div>
        <div className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-semibold">Active</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="bg-slate-700/80 rounded-lg p-2.5">
            <div className="text-[9px] text-slate-400 mb-0.5">{m.label}</div>
            <div className="text-sm font-bold text-white">{m.value}</div>
            <div className="flex items-center gap-0.5 mt-0.5">
              <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              <span className="text-[9px] text-green-400 font-medium">{m.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-700/50 rounded-lg p-2.5">
        <div className="text-[9px] text-slate-400 mb-2">Daily Conversions</div>
        <div className="flex items-end gap-1 h-10">
          {[4, 6, 5, 8, 7, 10, 9, 12, 10, 11, 13, 12, 14].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-500/70 rounded-sm" style={{ height: `${(h / 14) * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="text-[10px] text-slate-400 text-center">
        Ad Spend: <span className="text-white font-semibold">AED 12,400</span> · Revenue: <span className="text-green-400 font-semibold">AED 65,720</span>
      </div>
    </div>
  );
}

function SocialMediaIllustration() {
  const posts = [
    { platform: "IG", color: "bg-pink-500", likes: "2.4K", comments: "184" },
    { platform: "LI", color: "bg-blue-700", likes: "890", comments: "67" },
    { platform: "FB", color: "bg-blue-500", likes: "1.1K", comments: "92" },
  ];
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white">Social Dashboard</div>
        <div className="text-[9px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">↑ +34% reach</div>
      </div>
      {posts.map((p) => (
        <div key={p.platform} className="bg-slate-700/60 rounded-lg p-3 flex items-start gap-3">
          <div className={`${p.color} w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
            {p.platform}
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-2 bg-slate-500/60 rounded w-full mb-1" />
            <div className="h-2 bg-slate-500/40 rounded w-3/4" />
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-[9px] text-rose-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                {p.likes}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-blue-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                {p.comments}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-slate-700/50 rounded-lg p-2 flex items-center justify-between">
        <span className="text-[9px] text-slate-400">Total Followers</span>
        <span className="text-xs font-bold text-white">48.6K</span>
        <span className="text-[9px] text-green-400">↑ +12.4%</span>
      </div>
    </div>
  );
}

function ContentMarketingIllustration() {
  const articles = [
    { title: "10 SEO Trends for 2025", tag: "SEO", status: "Published" },
    { title: "UAE B2B Content Guide", tag: "Strategy", status: "In Review" },
    { title: "How to Build Brand Auth...", tag: "Content", status: "Drafting" },
  ];
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white">Editorial Calendar</div>
        <div className="text-[9px] text-blue-400">June 2026</div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} className="text-[8px] text-slate-500 pb-1">{d}</div>
        ))}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <div key={d} className={`text-[9px] rounded py-0.5 ${[3, 10, 17, 24].includes(d) ? "bg-orange-500 text-white font-bold" : [6, 13, 20, 27].includes(d) ? "bg-blue-500/30 text-blue-300" : "text-slate-500"}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {articles.map((a, i) => (
          <div key={i} className="bg-slate-700/60 rounded-lg p-2.5 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-white truncate">{a.title}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 rounded">{a.tag}</span>
                <span className={`text-[8px] ${a.status === "Published" ? "text-green-400" : a.status === "In Review" ? "text-yellow-400" : "text-slate-400"}`}>
                  ● {a.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[9px] text-slate-400 text-center">12 pieces published this month · Avg. 1,840 words</div>
    </div>
  );
}

function EmailMarketingIllustration() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white">Email Automation</div>
        <div className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Live</div>
      </div>
      <div className="bg-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-3 py-2">
          <div className="w-24 h-2 bg-white/80 rounded mb-1" />
          <div className="w-16 h-1.5 bg-white/50 rounded" />
        </div>
        <div className="p-3 space-y-1.5">
          <div className="w-full h-1.5 bg-slate-500/60 rounded" />
          <div className="w-5/6 h-1.5 bg-slate-500/60 rounded" />
          <div className="w-4/6 h-1.5 bg-slate-500/60 rounded" />
          <div className="mt-2 w-20 h-5 bg-orange-500 rounded text-white text-[9px] flex items-center justify-center font-semibold">
            Claim Offer
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[{ label: "Open Rate", val: "47.2%" }, { label: "Click Rate", val: "9.8%" }, { label: "Revenue", val: "AED 24K" }].map((m) => (
          <div key={m.label} className="bg-slate-700/80 rounded-lg p-2">
            <div className="text-xs font-bold text-white">{m.val}</div>
            <div className="text-[8px] text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="text-[9px] text-slate-400 mb-1">Automation Sequence</div>
        {[{ step: "Welcome Email", delay: "Instant" }, { step: "Value Email", delay: "+2 days" }, { step: "Offer Email", delay: "+5 days" }].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold shrink-0">{i + 1}</div>
            <div className="flex-1 text-[10px] text-slate-300">{s.step}</div>
            <div className="text-[8px] text-slate-500">{s.delay}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsIllustration() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white">Analytics Dashboard</div>
        <div className="text-[9px] text-slate-400">Last 30 days</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Sessions", val: "42,816", change: "+18%" },
          { label: "Conversions", val: "1,284", change: "+24%" },
          { label: "Avg. Session", val: "3m 42s", change: "+12%" },
          { label: "Bounce Rate", val: "38.4%", change: "-6%" },
        ].map((m) => (
          <div key={m.label} className="bg-slate-700/80 rounded-lg p-2.5">
            <div className="text-[9px] text-slate-400">{m.label}</div>
            <div className="text-xs font-bold text-white mt-0.5">{m.val}</div>
            <div className="text-[9px] text-green-400 font-medium">{m.change}</div>
          </div>
        ))}
      </div>
      <div className="bg-slate-700/50 rounded-lg p-2.5">
        <div className="text-[9px] text-slate-400 mb-2">Sessions Trend</div>
        <div className="flex items-end gap-0.5 h-12">
          {[30,40,35,55,45,60,50,70,65,75,68,80,72,85].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${(h/85)*100}%`, background: `rgba(59,130,246,${0.4 + (i/14)*0.5})` }} />
          ))}
        </div>
      </div>
      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 text-center">
        <div className="text-[9px] text-blue-300 font-medium">Custom GA4 + Looker Studio dashboards</div>
      </div>
    </div>
  );
}

function LocalSeoIllustration() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-2xl ring-1 ring-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white">Local Visibility</div>
        <div className="text-[9px] text-orange-400">Dubai · Abu Dhabi</div>
      </div>
      <div className="bg-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-slate-600/80 p-3 relative" style={{ height: "80px" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 15px,rgba(100,116,139,0.3) 15px,rgba(100,116,139,0.3) 16px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(100,116,139,0.3) 20px,rgba(100,116,139,0.3) 21px)" }} />
          {[{ x: "35%", y: "30%", primary: true }, { x: "60%", y: "55%" }, { x: "20%", y: "65%" }].map((pin, i) => (
            <div key={i} className="absolute" style={{ left: pin.x, top: pin.y }}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pin.primary ? "bg-orange-500 border-orange-300" : "bg-blue-500 border-blue-300"}`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold shrink-0">G</div>
          <div>
            <div className="text-[10px] font-semibold text-slate-800">Your Business Name</div>
            <div className="flex">
              {[1,2,3,4,5].map((s) => <span key={s} className="text-yellow-400 text-[9px]">★</span>)}
              <span className="text-[9px] text-slate-500 ml-1">4.9 (186 reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-[9px] text-green-600 font-medium">
          <span>● Open now</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">+971 4 XXX XXXX</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
        {[{ label: "Citations", val: "284" }, { label: "Reviews", val: "186" }, { label: "Rank", val: "#1" }].map((m) => (
          <div key={m.label} className="bg-slate-700/80 rounded p-1.5">
            <div className="font-bold text-orange-400">{m.val}</div>
            <div className="text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceHeroIllustration({ category }: Props) {
  return (
    <div aria-hidden="true" className="relative select-none pointer-events-none">
      <div className="absolute -inset-4 bg-blue-600/5 rounded-3xl blur-2xl" />
      <div className="relative">
        {category === "web-design" && <WebDesignIllustration />}
        {category === "seo" && <SeoIllustration />}
        {category === "google-ads" && <GoogleAdsIllustration />}
        {category === "social-media" && <SocialMediaIllustration />}
        {category === "content-marketing" && <ContentMarketingIllustration />}
        {category === "email-marketing" && <EmailMarketingIllustration />}
        {category === "analytics" && <AnalyticsIllustration />}
        {category === "local-seo" && <LocalSeoIllustration />}
        {!["web-design","seo","google-ads","social-media","content-marketing","email-marketing","analytics","local-seo"].includes(category) && (
          <div className="bg-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-600/30 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div className="text-slate-400 text-xs">Digital Marketing Services</div>
          </div>
        )}
      </div>
    </div>
  );
}
