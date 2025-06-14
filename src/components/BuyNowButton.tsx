
import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Button: "Buy Now" for a product.
 * - Adds product to cart if not present, then routes to cart (not direct checkout) for summary review.
 * - Uses optimistic instant add (like Flipkart).
 * - Always uses quantity = 1 if not already in cart.
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
      });
    } else {
      updateQty(product.id.toString(), quantity > 0 ? quantity : 1);
    }
    navigate("/cart");
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="ml-2 bg-white dark:bg-lux-black border border-gray-200 hover:bg-amber-100/80 shadow transition-all min-w-[64px] !py-2"
      onClick={handleBuyNow}
      aria-label={t("buyNow")}
      type="button"
      disabled={disabled}
      tabIndex={0}
    >
      {t("buyNow")}
    </Button>
  );
}
