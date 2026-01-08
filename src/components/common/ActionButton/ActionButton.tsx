import { Eye, Edit, Trash2 } from "lucide-react";

interface ActionButtonProps {
  action: "view" | "edit" | "delete";
  onClick: () => void;
  title?: string;
  size?: "sm" | "md";
}

const actionConfig = {
  view: {
    icon: Eye,
    color: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
    darkColor: "text-blue-600",
    bgColor: "hover:bg-blue-50",
    label: "View details",
  },
  edit: {
    icon: Edit,
    color: "text-amber-600 hover:text-amber-700 hover:bg-amber-50",
    darkColor: "text-amber-600",
    bgColor: "hover:bg-amber-50",
    label: "Edit record",
  },
  delete: {
    icon: Trash2,
    color: "text-red-600 hover:text-red-700 hover:bg-red-50",
    darkColor: "text-red-600",
    bgColor: "hover:bg-red-50",
    label: "Delete record",
  },
};

export function ActionButton({ 
  action, 
  onClick, 
  title,
  size = "md" 
}: ActionButtonProps) {
  const config = actionConfig[action];
  const Icon = config.icon;
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={onClick}
      title={title || config.label}
      aria-label={title || config.label}
      className={`inline-flex items-center justify-center ${padding} ${config.color} rounded-lg transition-all duration-200 group`}
    >
      <Icon className={`${iconSize} group-hover:scale-110 transition-transform`} />
    </button>
  );
}
