
import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center border rounded-xl px-2 py-1 bg-white/90 dark:bg-lux-black/80 shadow-sm gap-1 select-none">
      <Button
        size="icon"
        variant="ghost"
        onClick={onDec}
        aria-label={t("subtract")}
        disabled={quantity <= 1 || disabled}
        className="!p-2.5"
        tabIndex={0}
      >
        <Minus size={20} />
      </Button>
      <span className="font-semibold text-green-700 px-1 text-base min-w-5 text-center">{quantity}</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={onInc}
        aria-label={t("add")}
        disabled={quantity >= stock || disabled}
        className="!p-2.5"
        tabIndex={0}
      >
        <Plus size={20} />
      </Button>
    </div>
  );
}
