
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

// Props: 
// - value: current search text
// - onChange: (text) => void
// - placeholder?: text shown when empty
const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto bg-white/80 border border-yellow-300 dark:bg-lux-black/70 rounded-2xl shadow px-3 py-2 mb-5">
      <Search className="text-yellow-600 mr-2" size={22} />
      <Input
        className="flex-1 bg-transparent outline-none text-lg font-medium placeholder:text-yellow-800/60 !border-none focus:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("searchPlaceholder") ?? "Search products, brands, categories..."}
        aria-label={t("search") || "Search"}
        autoComplete="off"
        spellCheck={false}
        type="search"
      />
    </div>
  );
};

export default SearchBar;
