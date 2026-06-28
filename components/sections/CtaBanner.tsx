import Button from "@/components/ui/Button";

interface CtaAction {
  label: string;
  href: string;
}

interface CtaBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta: CtaAction;
  secondaryCta?: CtaAction;
  variant?: "navy" | "blue" | "orange";
}

const variantClasses = {
  navy: {
    wrapper: "bg-slate-900",
    eyebrow: "ems-gradient-text",
    title: "text-white",
    description: "text-slate-300",
    primary: "white" as const,
    secondary: "ghost" as const,
    secondaryText: "text-slate-400 hover:text-white",
  },
  blue: {
    wrapper: "bg-blue-600",
    eyebrow: "text-blue-200",
    title: "text-white",
    description: "text-blue-100",
    primary: "white" as const,
    secondary: "ghost" as const,
    secondaryText: "text-blue-200 hover:text-white",
  },
  orange: {
    wrapper: "ems-gradient-bg",
    eyebrow: "text-white/80",
    title: "text-white",
    description: "text-white/80",
    primary: "white" as const,
    secondary: "ghost" as const,
    secondaryText: "text-white/70 hover:text-white",
  },
};

export default function CtaBanner({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = "navy",
}: CtaBannerProps) {
  const v = variantClasses[variant];

  return (
    <section className={v.wrapper}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {eyebrow && (
            <p
              className={`text-xs font-semibold uppercase tracking-[0.15em] mb-3 ${v.eyebrow}`}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance ${v.title}`}
          >
            {title}
          </h2>
          {description && (
            <p className={`text-base md:text-lg leading-relaxed mb-8 ${v.description}`}>
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant={v.primary} size="lg" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                variant={v.secondary}
                size="lg"
                href={secondaryCta.href}
                className={v.secondaryText}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
