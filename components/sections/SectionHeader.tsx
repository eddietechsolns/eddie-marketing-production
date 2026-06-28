interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  full: "max-w-none",
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  maxWidth = "md",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={[
        "mb-10 md:mb-14",
        isCenter ? `mx-auto text-center ${maxWidthClasses[maxWidth]}` : maxWidthClasses[maxWidth],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.15em] mb-3 ems-gradient-text"
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold tracking-tight text-balance ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
