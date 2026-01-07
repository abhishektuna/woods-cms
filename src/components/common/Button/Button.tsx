import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface UniversalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: ReactNode;
  icon?: ReactNode;                 // ✅ optional icon
  iconPosition?: "left" | "right";  // ✅ optional position
  variant?: Variant;
  loading?: boolean;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  text,
  children,
  icon,
  iconPosition = "left",
  variant = "primary",
  loading = false,
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  style,
  ...props
}: UniversalButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles =
    "font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed relative";

  const sizeStyles: Record<Size, React.CSSProperties> = {
    sm: { padding: "4px 10px", fontSize: "14px" },
    md: { padding: "6px 12px", fontSize: "16px" },
    lg: { padding: "10px 18px", fontSize: "18px" },
  };

  const variantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          background: isDisabled ? "#eb8b1d80" : "#eb8b1d",
          color: "#fff",
          border: "none",
        };
      case "secondary":
        return {
          background: isDisabled ? "#b5ce0780" : "#b5ce07",
          color: "#000",
          border: "none",
        };
      case "outline":
        return {
          background: "transparent",
          border: "2px solid #eb8b1d",
          color: isDisabled ? "#999" : "#374151",
        };
      case "danger":
        return {
          background: "#dc2626",
          color: "#fff",
          border: "none",
        };
      default:
        return {};
    }
  };

  const content = text ?? children;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`${baseStyles} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        borderRadius: 4,
        cursor: isDisabled ? "not-allowed" : "pointer",
        marginRight: 8,
        ...sizeStyles[size],
        ...variantStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        if (variant === "primary") e.currentTarget.style.background = "#d97a16";
        else if (variant === "secondary") e.currentTarget.style.background = "#a3ba06";
        else if (variant === "outline") {
          e.currentTarget.style.background = "#eb8b1d";
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        if (variant === "primary") e.currentTarget.style.background = "#eb8b1d";
        else if (variant === "secondary") e.currentTarget.style.background = "#b5ce07";
        else if (variant === "outline") {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#374151";
        }
      }}
      {...props}
    >
      {/* Loader */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon + Text */}
      {!loading && icon && iconPosition === "left" && icon}
      <span>{loading ? "Loading..." : content}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
