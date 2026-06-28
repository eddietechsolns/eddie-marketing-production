import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost"
  | "white"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps>;
type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 active:scale-95 shadow-sm hover:shadow-md",
  accent:
    "ems-btn-gradient text-white",
  secondary:
    "bg-white text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  white:
    "bg-white text-slate-900 hover:bg-slate-50 shadow-sm hover:shadow-md",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 active:scale-95 shadow-sm active:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    href,
    external,
    fullWidth,
    icon,
    iconPosition = "left",
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...(rest as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ComponentPropsWithoutRef<"button">)}
    >
      {content}
    </button>
  );
}
