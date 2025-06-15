
import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    navigate("/checkout", { state: { buyNow: { ...product, quantity: 1 } } });
  };

  return (
    <Button
      size="default"
      variant="outline"
      className="ml-2 bg-white dark:bg-ssblue-primary border border-ssblue-secondary hover:bg-ssblue-accent/20 dark:hover:bg-ssblue-accent/30 shadow transition-all min-h-[44px] rounded-md text-ssblue-primary dark:text-ssblue-onblue font-semibold"
      onClick={handleBuyNow}
      aria-label={t("buyNow")}
      type="button"
      disabled={disabled}
      tabIndex={0}
      style={{ minHeight: 44 }}
    >
      {t("buyNow")}
    </Button>
  );
}
