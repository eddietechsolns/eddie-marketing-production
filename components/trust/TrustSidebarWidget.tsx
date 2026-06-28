const POINTS = [
  "Senior Strategist — Not a Junior AM",
  "No Long-Term Lock-In Contracts",
  "Full Conversion Tracking Included",
  "UAE Licensed & Locally Based",
];

export function TrustSidebarWidget() {
  return (
    <div className="bg-slate-950 rounded-xl p-6 text-white">
      <h3 className="text-sm font-bold mb-4 text-white">Why Work With Eddie</h3>
      <ul className="space-y-3">
        {POINTS.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-slate-300">
            <svg
              className="w-4 h-4 text-teal-500 shrink-0"
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
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
