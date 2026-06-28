type SectionBg = "white" | "light" | "navy" | "slate";
type SectionPy = "sm" | "md" | "lg" | "xl";

interface SectionProps {
  bg?: SectionBg;
  py?: SectionPy;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const bgClasses: Record<SectionBg, string> = {
  white: "bg-white",
  light: "bg-slate-50",
  navy: "bg-slate-900",
  slate: "bg-slate-800",
};

const pyClasses: Record<SectionPy, string> = {
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
};

export default function Section({
  bg = "white",
  py = "lg",
  id,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={[bgClasses[bg], pyClasses[py], className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
