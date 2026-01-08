import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
}

export function Modal({ isOpen, onClose, title, children, size = "md", showHeader = true }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Lock body scroll while modal is open
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
    // Close if clicking backdrop, not the content
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
        className={`relative w-full ${maxWidth} mx-auto my-8 md:my-0 bg-white rounded-xl shadow-2xl overflow-hidden`}
      >
        {/* Animated container */}
        <div className={`transform transition-all duration-200 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          {showHeader && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {title || "Modal"}
              </h2>
              <button
                aria-label="Close"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Scrollable content area (single scrollbar) */}
          <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Optional footer slot could go here if needed */}
        </div>
      </div>
    </div>
  );
}
