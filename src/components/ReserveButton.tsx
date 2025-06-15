
import React from "react";
import { Button } from "@/components/ui/button";
import { handleReserve } from "@/utils/handleReserve";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus } from "lucide-react";

type ReserveButtonProps = {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string | undefined | null;
  };
  qty: number;
  onReserved: () => void;
  disabled?: boolean;
};

const ReserveButton: React.FC<ReserveButtonProps> = ({ product, qty, onReserved, disabled }) => {
  const { t } = useTranslation();

  if (qty < 1 || disabled) return null;

  return (
    <Button
      className="bg-green-600 text-white rounded-md px-3 py-2 mt-2 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none min-h-[44px] flex items-center gap-2 text-base"
      onClick={e => {
        e.stopPropagation();
        handleReserve(product, qty);
        onReserved();
      }}
      aria-label={t("reserveInStore") || "Reserve in Store"}
      type="button"
      disabled={disabled}
      tabIndex={0}
      style={{ borderRadius: 8 }}
    >
      <Plus size={18} className="mr-1" />
      <ShoppingCart size={18} className="mr-1" />
      {t("reserveInStore") || "Reserve in Store"}
    </Button>
  );
};
export default ReserveButton;
