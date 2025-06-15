
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
  quantity?: number;
};

export default function AddToCartButton({ product, onCartChange, disabled, quantity }: AddToCartButtonProps) {
  const { t } = useTranslation();
  const addToCart = useCartStore(s => s.addToCart);
  const items = useCartStore(s => s.items);
  const cartItem = items.find(i => i._id === product.id?.toString());
  const qty = typeof quantity === "number" ? quantity : cartItem?.quantity ?? 0;

  if (qty < 1) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (qty < 1) {
      toast({
        title: t("cannotAddZero"),
        description: t("Please increase quantity to add this product to cart."),
        variant: "destructive"
      });
      return;
    }

    addToCart({
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: qty,
      stock: product.stock,
      image: product.image || undefined,
    }, qty);

    toast({
      duration: 1000,
      title: t("addedToCart"),
      description: (
        <div className="flex items-center gap-2">
          <span className="animate-pulse">✅</span>
          <span className="font-semibold text-lux-gold">
            {t("addedToCart") || "Added to Cart"}
          </span>
        </div>
      ),
      variant: "default"
    });

    if (onCartChange) onCartChange(qty);
  };

  return (
    <Button
      size="default"
      className="lux-btn text-base gap-1 overflow-hidden min-h-[44px] rounded-[8px] !px-6 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none animate-fade-in dark:bg-[#FFD70022] dark:text-[#FFD700] dark:border-[#FFD70099]"
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
