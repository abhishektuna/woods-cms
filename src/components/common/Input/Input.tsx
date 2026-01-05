import type { InputHTMLAttributes } from "react";
import type { ReactNode } from "react";
import { useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ 
  label, 
  error, 
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
          {label}
          {props.required && <span style={{ color: "#eb8b1d" }}>*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`w-full border-2 rounded-lg px-4 py-2.5 transition-all duration-200 
            ${leftIcon ? 'pl-10' : ''} 
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300' 
              : 'border-gray-200'
            }
            focus:outline-none
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            placeholder:text-gray-400
            ${className}`}
          onFocus={(e) => {
            setIsFocused(true);
            if (!error) {
              e.currentTarget.style.borderColor = "#eb8b1d";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235, 139, 29, 0.1)";
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (!error) {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          style={{
            borderColor: error ? "#fca5a5" : (isFocused ? "#eb8b1d" : undefined),
            boxShadow: isFocused ? (error ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(235, 139, 29, 0.1)") : "none"
          }}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span className="text-xs text-gray-500">{helperText}</span>
      )}
    </div>
  );
}
