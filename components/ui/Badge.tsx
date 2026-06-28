type BadgeVariant =
  | "default"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "slate"
  | "purple";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  orange: "bg-teal-50 text-teal-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-600",
  purple: "bg-purple-50 text-purple-700",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-teal-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
  purple: "bg-purple-500",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
