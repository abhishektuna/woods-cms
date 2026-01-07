// Enhanced TextInput Component
export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
    />
  </div>
);