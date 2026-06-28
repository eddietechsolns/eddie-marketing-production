import Link from "next/link";

interface CardProps {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  className?: string;
  children: React.ReactNode;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  hover = false,
  padding = "md",
  border = true,
  className = "",
  children,
}: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-xl",
        border ? "border border-slate-200" : "",
        hover
          ? "transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
          : "shadow-sm",
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

interface ServiceCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  href: string;
  category?: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  href,
  category,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
      )}
      {category && (
        <p className="text-xs font-medium ems-gradient-text uppercase tracking-wider mb-1">
          {category}
        </p>
      )}
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">
        {description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 gap-1">
        Learn more
        <svg
          className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  accent?: "blue" | "orange" | "green";
}

const accentBar: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-blue-500",
  orange: "ems-gradient-bg",
  green: "bg-emerald-500",
};

export function StatCard({
  value,
  label,
  description,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
      <div
        className={`w-10 h-1 rounded-full mx-auto mb-4 ${accentBar[accent]}`}
      />
      <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
        {value}
      </div>
      <div className="text-sm font-semibold text-slate-700 mb-1">{label}</div>
      {description && (
        <div className="text-xs text-slate-500">{description}</div>
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`flex gap-4 p-6 bg-white rounded-xl border border-slate-100 ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
