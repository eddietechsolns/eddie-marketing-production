"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={[
              "w-full appearance-none px-3.5 py-2.5 pr-9 text-sm text-slate-900 bg-white",
              "border border-slate-300 rounded-lg",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "transition-colors duration-150",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "",
              "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {(error || hint) && (
          <p className={`text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
