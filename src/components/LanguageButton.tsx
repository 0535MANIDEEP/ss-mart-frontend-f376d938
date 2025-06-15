
import React from "react";
import clsx from "clsx";

type LanguageButtonProps = {
  code: string;
  label: string;
  active?: boolean;
  onClick: (code: string) => void;
};

export default function LanguageButton({ code, label, active, onClick }: LanguageButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onClick(code)}
      className={clsx(
        "lang-btn px-4 py-2 mr-2 rounded-full font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-lux-gold/70 min-w-[46px]",
        active
          ? "bg-black text-white dark:bg-lux-gold dark:text-black"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      )}
      style={{
        minHeight: 40,
        marginBottom: 6,
        fontSize: 16,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}
