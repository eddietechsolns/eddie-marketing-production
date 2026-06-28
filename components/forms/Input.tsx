"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-stretch">
          {prefix && (
            <span className="flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "flex-1 w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white",
              "border border-slate-300 placeholder-slate-400",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "transition-colors duration-150",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "",
              prefix ? "rounded-r-lg" : suffix ? "rounded-l-lg" : "rounded-lg",
              "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {suffix && (
            <span className="flex items-center px-3 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            className={`text-xs ${
              error ? "text-red-600" : "text-slate-500"
            }`}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
