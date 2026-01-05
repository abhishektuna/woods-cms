import type{ ChangeEvent } from "react";

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
  rows = 4,
}: TextareaProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#eb8b1d] focus:border-[#eb8b1d] transition"
      />
    </div>
  );
}
