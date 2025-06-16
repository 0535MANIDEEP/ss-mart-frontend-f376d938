
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

const QuantitySelector: React.FC<Props> = ({
  quantity,
  stock,
  onInc,
  onDec,
  disabled = false
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center border rounded-lg px-2 py-1 min-h-[44px] gap-1 select-none bg-white/90 dark:bg-ssblue-primary border-ssblue-secondary dark:border-ssblue-accent/50 shadow-sm">
      {quantity > 0 && (
        <button
          onClick={() => { if (quantity > 0 && !disabled) onDec(); }}
          aria-label={t("subtract")}
          disabled={quantity <= 0 || disabled}
          className="w-9 h-9 rounded-full bg-ssblue-primary text-ssblue-onblue hover:bg-ssblue-secondary disabled:opacity-50 shadow-sm dark:bg-ssblue-secondary dark:hover:bg-ssblue-accent dark:disabled:bg-ssblue-primary/50 transition-all"
          tabIndex={0}
          type="button"
        >
          <Minus size={18} />
        </button>
      )}
      {quantity > 0 && (
        <span className="font-semibold px-1 text-base min-w-5 text-center text-ssblue-primary dark:text-ssblue-accent dark:font-bold">
          {quantity}
        </span>
      )}
      <button
        onClick={() => { if (quantity < stock && !disabled) onInc(); }}
        aria-label={t("add")}
        disabled={quantity >= stock || disabled}
        className="w-9 h-9 rounded-full bg-ssblue-primary text-ssblue-onblue hover:bg-ssblue-secondary disabled:opacity-50 shadow-sm dark:bg-ssblue-secondary dark:hover:bg-ssblue-accent dark:disabled:bg-ssblue-primary/50 transition-all"
        tabIndex={0}
        type="button"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default QuantitySelector;
