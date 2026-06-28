import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[660px] bg-slate-950 overflow-hidden flex items-center">
      <div className="absolute -top-60 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none ems-orb-left" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(37,99,235,0.08) 60%, transparent 100%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-3xl pointer-events-none ems-orb-right" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(37,99,235,0.06) 60%, transparent 100%)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-20" style={{ background: "var(--ems-gradient-glow)" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-blue-300 text-xs font-medium tracking-wide">
                UAE &middot; GCC &middot; Europe
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.06] tracking-tight mb-6">
              Digital Marketing{" "}
              <span className="ems-gradient-text">Agency</span>
              <span className="block">for UAE, GCC &amp; Europe</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              We help ambitious businesses grow with data-driven SEO, Google Ads,
              social media, and web design. Real results, measurable ROI, every
              campaign.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button variant="accent" size="lg" href="/request-for-a-proposal">
                Get a Free Strategy Session
              </Button>
              <Button
                variant="ghost"
                size="lg"
                href="/portfolio"
                className="text-slate-200 hover:text-white hover:bg-white/10"
              >
                View Our Work
                <svg
                  className="w-4 h-4 ml-1 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                "50+ Clients Served",
                "8 Case Studies",
                "10 Industries",
                "UAE Licensed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg
                    className="w-3.5 h-3.5 text-teal-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[380px]">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Campaign Performance</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full tracking-wide">
                    LIVE
                  </span>
                </div>

                <div className="px-5 py-5 space-y-4">
                  {[
                    { label: "Organic Traffic", delta: "+312%", bar: 92, color: "bg-blue-500" },
                    { label: "Lead Volume", delta: "+186%", bar: 74, color: "ems-gradient-bg" },
                    { label: "Conversion Rate", delta: "+43%", bar: 56, color: "bg-emerald-500" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">{metric.label}</span>
                        <span className="text-xs font-bold text-emerald-400">{metric.delta}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.color} rounded-full`}
                          style={{ width: `${metric.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-slate-700/50 flex items-center gap-2">
                  {["SEO", "Google Ads", "Social Media"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute -top-5 -right-5 ems-gradient-bg text-white rounded-xl px-4 py-3 shadow-xl shadow-blue-500/30">
                <p className="text-[10px] font-medium opacity-75 leading-none mb-0.5">Best result</p>
                <p className="text-2xl font-bold leading-tight">+524%</p>
                <p className="text-[10px] opacity-75 leading-none mt-0.5">Traffic growth</p>
              </div>

              <div className="absolute -bottom-4 -left-5 bg-white text-slate-900 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">UAE Licensed</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Eddie Marketing FZE</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
