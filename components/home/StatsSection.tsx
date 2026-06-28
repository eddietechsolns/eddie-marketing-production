const STATS = [
  {
    value: "50+",
    label: "Clients Served",
    sub: "From real estate to healthcare across UAE & GCC",
  },
  {
    value: "312%",
    label: "Average Traffic Growth",
    sub: "Across SEO clients in UAE & GCC",
  },
  {
    value: "AED 2M+",
    label: "Revenue Generated",
    sub: "Attributable to our campaigns",
  },
  {
    value: "UAE",
    label: "Licensed & Based",
    sub: "Eddie Marketing Solutions FZE",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-purple-950/20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-700/50 divide-y lg:divide-y-0 border-y border-slate-700/50">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6 md:px-8 lg:px-10 py-10 text-center lg:text-left">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-slate-200 mb-1">{stat.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
