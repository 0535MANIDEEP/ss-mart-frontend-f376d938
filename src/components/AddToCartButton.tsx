
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type AddToCartButtonProps = {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string | null | undefined;
  };
  onCartChange?: (quantity: number) => void;
  disabled?: boolean;
};

/**
 * Adds to cart (always at least 1), shows toast, and instantly/optimistically updates UI.
 * Never redirects!
 */
export default function AddToCartButton({ product, onCartChange, disabled }: AddToCartButtonProps) {
  const { t } = useTranslation();
  const addToCart = useCartStore(s => s.addToCart);
  const items = useCartStore(s => s.items);
  const cartItem = items.find(i => i._id === product.id?.toString());
  const quantity = cartItem?.quantity ?? 0;

  const DopamineConfirm = () => (
    <div className="flex items-center gap-2">
      <span className="animate-pulse">✅</span>
      <span className="font-semibold text-lux-gold">{t("addedToCart")}</span>
    </div>
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      image: product.image || undefined,
    });
    toast({
      duration: 1000,
      title: t("addedToCart"),
      description: <DopamineConfirm />,
      variant: "default"
    });
    if (onCartChange) onCartChange((quantity ?? 0) + 1);
  };

  return (
    <Button
      size="default"
      className="lux-btn text-base gap-1 relative overflow-hidden min-h-[44px] rounded-[8px] !px-6 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
      aria-label={t("addToCart")}
      onClick={handleClick}
      type="button"
      disabled={disabled}
      tabIndex={0}
      style={{ minHeight: 44, borderRadius: 8 }}
    >
      <ShoppingCart size={18} /> {t("addToCart")}
    </Button>
  );
}
