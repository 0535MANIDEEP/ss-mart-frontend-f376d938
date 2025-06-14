
import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Button: "Buy Now" for a product.
 * - Adds/updates product to cart (qty=1 if not in cart), then goes to *Checkout* for review.
 * - Passes minimal info via location state for review and direct checkout UX.
 * - Always accessible contrast and minimum height.
 */
type Props = {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string | null | undefined;
  };
  disabled?: boolean;
};

export default function BuyNowButton({ product, disabled }: Props) {
  const { t } = useTranslation();
  const addToCart = useCartStore(s => s.addToCart);
  const updateQty = useCartStore(s => s.updateQuantity);
  const items = useCartStore(s => s.items);
  const navigate = useNavigate();
  const cartItem = items.find(i => i._id === product.id?.toString());
  const quantity = cartItem?.quantity ?? 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) {
      addToCart({
        _id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        image: product.image || undefined,
      }, 1);
    } else {
      updateQty(product.id.toString(), quantity > 0 ? quantity : 1);
    }
    // Instead of navigating to /cart, go to /checkout, and pass only this product (simulate "single buy")
    navigate("/checkout", { state: { buyNow: { ...product, quantity: 1 } } });
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="ml-2 bg-white dark:bg-lux-black border border-gray-300 dark:border-gray-600 hover:bg-amber-100/80 shadow transition-all min-h-[44px] rounded-[8px] text-primary dark:text-lux-gold font-semibold"
      onClick={handleBuyNow}
      aria-label={t("buyNow")}
      type="button"
      disabled={disabled}
      tabIndex={0}
      style={{ minHeight: 44, borderRadius: 8 }}
    >
      {t("buyNow")}
    </Button>
  );
}
