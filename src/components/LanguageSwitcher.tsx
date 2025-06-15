
import { useTranslation } from "react-i18next";
import React from "react";
import LanguageButton from "./LanguageButton";

// Config: You may add more languages here if translations exist
const LANGUAGES = [
  { label: "EN", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "తెలుగు", code: "te" },
];

export default function LanguageSwitcher({
  orientation = "horizontal"
}: { orientation?: "horizontal" | "vertical" } = {}) {
  const { i18n } = useTranslation();
  // `i18n.language` is always lowercase
  const currLang = i18n.language || localStorage.getItem("lang") || "en";

  const handleLang = (lng: string) => {
    if (lng !== currLang) {
      i18n.changeLanguage(lng);
      localStorage.setItem("lang", lng);
    }
  };

  return (
    <nav
      aria-label="Site language"
      className={orientation === "vertical"
        ? "flex flex-col gap-1 items-start mt-4"
        : "flex gap-1 items-center"}
    >
      {LANGUAGES.map(l => (
        <LanguageButton
          key={l.code}
          code={l.code}
          label={l.label}
          active={l.code === currLang}
          onClick={handleLang}
        />
      ))}
    </nav>
  );
}
