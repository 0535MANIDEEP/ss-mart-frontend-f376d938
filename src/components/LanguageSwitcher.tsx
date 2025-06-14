
import { useTranslation } from "react-i18next";
import React from "react";

/**
 * A minimalist, accessible language switcher with live instant toggle.
 * Uses text-only buttons per requirements.
 */
const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "తెలుగు", code: "te" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currLang = i18n.language || localStorage.getItem("lang") || "en";

  const handleLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <nav
      aria-label="Site language"
      className="flex items-center gap-1 font-semibold text-base select-none"
    >
      {LANGUAGES.map((l, idx) => (
        <React.Fragment key={l.code}>
          <button
            type="button"
            onClick={() => handleLang(l.code)}
            className={`transition-colors min-w-[60px] px-1 ring-offset-2 rounded-md focus-visible:ring-2 focus-visible:ring-lux-gold whitespace-nowrap
              ${l.code === currLang
                ? "text-green-700 dark:text-lux-gold underline underline-offset-4 decoration-2 pointer-events-none font-bold"
                : "hover:text-lux-gold text-gray-700 dark:text-gray-100"}
            `}
            aria-current={l.code === currLang ? "true" : undefined}
            disabled={l.code === currLang}
            tabIndex={0}
          >
            {l.label}
          </button>
          {idx < LANGUAGES.length - 1 && (
            <span className="mx-1 text-gray-400 select-none" aria-hidden="true">|</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
