import React, { useEffect, useRef, useState } from "react";
import { X, Eye } from "lucide-react";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function ViewModal({ isOpen, onClose, title, children, size = "md" }: ViewModalProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
        setMounted(false);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidth = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-5xl" : "max-w-3xl";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6 bg-black/30 backdrop-blur-sm transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={contentRef}
        className={`relative w-full ${maxWidth} mx-auto my-8 md:my-0 bg-white rounded-2xl shadow-2xl overflow-hidden`}
      >
        <div className={`transform transition-all duration-200 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          {/* Header with Icon */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#eb8b1d]/10 rounded-lg">
                <Eye className="w-5 h-5 text-[#eb8b1d]" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {title || "View Details"}
              </h2>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
