import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed relative overflow-hidden";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const variantStyles = {
    primary: "text-white shadow-md hover:shadow-lg disabled:opacity-50",
    secondary: "text-black shadow-md hover:shadow-lg disabled:opacity-50",
    outline: "border-2 text-gray-700 hover:text-white disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-50"
  };

  const getVariantStyles = () => {
    if (variant === "primary") {
      return {
        background: disabled || loading ? "#eb8b1d80" : "#eb8b1d",
        ...(!(disabled || loading) && {
          transition: "all 0.2s"
        })
      };
    }
    if (variant === "secondary") {
      return {
        background: disabled || loading ? "#b5ce0780" : "#b5ce07",
        ...(!(disabled || loading) && {
          transition: "all 0.2s"
        })
      };
    }
    if (variant === "outline") {
      return {
        borderColor: "#eb8b1d",
        color: disabled || loading ? "#999" : "#374151",
        ...(!(disabled || loading) && {
          transition: "all 0.2s"
        })
      };
    }
    return {};
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={getVariantStyles()}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "#d97a16";
        } else if (variant === "secondary") {
          e.currentTarget.style.background = "#a3ba06";
        } else if (variant === "outline") {
          e.currentTarget.style.background = "#eb8b1d";
          e.currentTarget.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "#eb8b1d";
        } else if (variant === "secondary") {
          e.currentTarget.style.background = "#b5ce07";
        } else if (variant === "outline") {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#374151";
        }
      }}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{loading ? "Loading..." : children}</span>
    </button>
  );
}