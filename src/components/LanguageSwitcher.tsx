
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";

const LANGUAGES = [
  { label: "English", code: "en", flag: "🇬🇧" },
  { label: "हिंदी", code: "hi", flag: "🇮🇳" },
  { label: "తెలుగు", code: "te", flag: "🇮🇳" }
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currLang = i18n.language || localStorage.getItem("lang") || "en";
  // Instead of reload, let i18n/react rerender all content instantly

  const handleLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    // No reload: i18next-react rerenders instantly!
  };

  const activeFlag =
    LANGUAGES.find((l) => l.code === currLang)?.flag ||
    LANGUAGES[0].flag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("language")}
          className="rounded-full focus-visible:ring-2 focus-visible:ring-lux-gold relative"
        >
          <span className="text-lg mr-0.5">{activeFlag}</span>
          <Menu size={18} aria-hidden className="ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="rounded-xl shadow-lg bg-white/95 dark:bg-lux-black/95 border border-lux-gold min-w-[140px] mt-1 py-2 px-0 text-base animate-fade-in backdrop-blur-[6px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleLang(l.code)}
            className={`flex items-center gap-2 px-4 py-2 font-medium hover:bg-lux-gold/20 dark:hover:bg-lux-gold/30 transition-colors cursor-pointer rounded-lg ${
              (l.code === currLang) ? "bg-lux-gold/15 text-lux-gold font-extrabold" : ""
            }`}
            tabIndex={0}
            aria-label={l.label}
            aria-selected={l.code === currLang}
          >
            <span className="text-lg flex-shrink-0">{l.flag}</span>
            <span>{l.label}</span>
            {l.code === currLang && (
              <span className="ml-auto text-xs text-green-700 rounded-full px-2 py-0.5 bg-green-100/40 dark:bg-green-800/50 font-semibold">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
