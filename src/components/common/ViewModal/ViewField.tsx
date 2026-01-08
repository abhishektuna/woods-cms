interface ViewFieldProps {
  label: string;
  value?: string | number | boolean | null;
  type?: "text" | "image" | "badge" | "list";
  className?: string;
}

export function ViewField({ label, value, type = "text", className = "" }: ViewFieldProps) {
  const getDisplayValue = () => {
    if (!value && value !== 0 && value !== false) return "-";

    switch (type) {
      case "badge":
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      case "image":
        return (
          <img
            src={String(value)}
            alt={label}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/100?text=No+Image";
            }}
          />
        );
      case "list":
        return Array.isArray(value) ? (
          <ul className="list-disc list-inside space-y-1">
            {value.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {String(item)}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-700">{String(value)}</span>
        );
      default:
        return <span className="text-gray-700">{String(value)}</span>;
    }
  };

  return (
    <div className={`py-3 border-b border-gray-100 last:border-0 ${className}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="text-sm">{getDisplayValue()}</div>
    </div>
  );
}
