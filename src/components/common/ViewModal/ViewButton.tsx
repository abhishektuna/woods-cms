import { Eye } from "lucide-react";

interface ViewButtonProps {
  onClick: () => void;
  label?: string;
  icon?: boolean;
}

export function ViewButton({ onClick, label = "View", icon = true }: ViewButtonProps) {
  if (icon) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
        title="View details"
        aria-label="View details"
      >
        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}
