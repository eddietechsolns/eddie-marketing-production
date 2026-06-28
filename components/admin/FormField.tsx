import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, name, required, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      id={props.name}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className ?? ""}`}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      id={props.name}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className ?? ""}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <select
      id={props.name}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${className ?? ""}`}
      {...props}
    >
      {children}
    </select>
  );
}
