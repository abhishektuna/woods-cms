import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxWidth?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  maxWidth = "max-w-md"
}: SearchBarProps) {
  return (
    <div className={`relative flex-1 ${maxWidth}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none transition-all hover:border-gray-400"
      />
    </div>
  );
}
