"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, rows = 4, className = "", ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={[
            "w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white",
            "border border-slate-300 rounded-lg placeholder-slate-400",
            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            "transition-colors duration-150 resize-y",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {(error || hint) && (
          <p className={`text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
