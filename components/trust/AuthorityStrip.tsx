const ITEMS = [
  "No Lock-In Contracts",
  "Transparent Reporting",
  "UAE Licensed",
  "Conversion Focused",
];

export function AuthorityStrip() {
  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-teal-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
