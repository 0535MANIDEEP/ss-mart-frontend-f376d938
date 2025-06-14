
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "తెలుగు", code: "te" }
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    window.location.reload(); // simplicity/reload
  };

  return (
    <div className="relative flex items-center" tabIndex={0}>
      <Button variant="ghost" size="icon" aria-label={t("language")} className="rounded-full">
        <Menu size={20} aria-hidden /> {/* Placeholder Menu icon */}
      </Button>
      <div className="absolute top-10 left-0 z-50 min-w-[120px] bg-white dark:bg-lux-black shadow rounded-lg border border-gray-100 dark:border-gray-800 flex-col hidden group-focus-within:flex group-hover:flex">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => handleLang(l.code)}
            className="w-full text-left px-4 py-2 hover:bg-lux-gold/10 dark:hover:bg-lux-gold/20"
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
