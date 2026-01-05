import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
  padding?: "sm" | "md" | "lg";
}

export function Card({ 
  title, 
  subtitle,
  children, 
  className = "",
  variant = "elevated",
  padding = "lg"
}: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const variantStyles = {
    default: "bg-white rounded-xl",
    elevated: "bg-white rounded-xl shadow-xl",
    bordered: "bg-white rounded-xl border-2 border-gray-200"
  };

  return (
    <div 
      className={`${variantStyles[variant]} ${paddingStyles[padding]} flex flex-col gap-6 w-full ${className}`}
      style={{
        background: variant === "elevated" 
          ? "linear-gradient(to bottom, #ffffff 0%, #f4f7f0 100%)"
          : undefined
      }}
    >
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}