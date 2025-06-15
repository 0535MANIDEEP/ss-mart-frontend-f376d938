
import React from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  quantity: number;
  stock: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
};

export default function QuantitySelector({
  quantity,
  stock,
  onInc,
  onDec,
  disabled = false
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center border rounded-[8px] px-2 py-1 min-h-[44px] gap-1 select-none bg-white/90 dark:bg-[#232336] dark:border-[#FFD70050]">
      <button
        onClick={() => {
          if (quantity > 0 && !disabled) onDec();
        }}
        aria-label={t("subtract")}
        disabled={quantity <= 0 || disabled}
        className="w-9 h-9 rounded-full 
          bg-gray-800 text-white 
          hover:bg-gray-900 
          disabled:opacity-50 shadow-md
          dark:bg-[#292848] 
          dark:hover:bg-[#FFD70055] 
          dark:text-[#FFD700] 
          dark:disabled:bg-[#23233699] 
          transition-all"
        tabIndex={0}
        type="button"
      >
        <Minus size={18} />
      </button>
      <span className="font-semibold px-1 text-base min-w-5 text-center text-green-700 dark:text-[#FFD700] dark:font-bold dark:drop-shadow-md">
        {quantity}
      </span>
      <button
        onClick={() => {
          if (quantity < stock && !disabled) onInc();
        }}
        aria-label={t("add")}
        disabled={quantity >= stock || disabled}
        className="w-9 h-9 rounded-full 
          bg-gray-800 text-white 
          hover:bg-gray-900 
          disabled:opacity-50 shadow-md
          dark:bg-[#292848] 
          dark:hover:bg-[#FFD70055] 
          dark:text-[#FFD700] 
          dark:disabled:bg-[#23233699] 
          transition-all"
        tabIndex={0}
        type="button"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
