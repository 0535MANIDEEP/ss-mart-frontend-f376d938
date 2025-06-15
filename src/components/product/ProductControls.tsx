
import React from "react";
import { useCartStore } from "@/store/cartStore";
import { Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import QuantitySelector from "@/components/QuantitySelector";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import type { Product } from "./ProductCard";

/** Props for ProductControls */
export interface ProductControlsProps {
  product: Product;
  name: string;
}

/**
 * Cart controls: add/remove/qty and buy now.
 */
const ProductControls: React.FC<ProductControlsProps> = ({ product, name }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const updateQty = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const items = useCartStore(s => s.items);

  const { t } = useTranslation();

  const cartItem = items.find(i => i._id === product.id?.toString());
  const quantity = cartItem?.quantity ?? 0;

  const handleInc = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ((quantity ?? 0) < product.stock) {
      updateQty(product.id.toString(), (quantity ?? 0) + 1);
      toast({
        duration: 900,
        title: t("addedAnother"),
        description: (
          <div className="flex items-center gap-2">
            <Plus size={16} className="inline text-green-600" />
            <span>{t("addedAnother")}</span>
          </div>
        ),
        variant: "default"
      });
    }
  };

  const handleDec = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (quantity > 1) {
      updateQty(product.id.toString(), quantity - 1);
    } else if (quantity === 1) {
      removeFromCart(product.id.toString());
      toast({
        duration: 1000,
        title: t("removedFromCart"),
        description: (
          <div className="flex items-center gap-2">
            <Minus size={16} className="inline text-red-600" />
            {t("removedFromCart")}
          </div>
        ),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2 items-center flex-nowrap mt-3">
      {quantity > 0 ? (
        <QuantitySelector
          quantity={quantity}
          stock={product.stock}
          onInc={handleInc}
          onDec={handleDec}
        />
      ) : (
        <AddToCartButton product={{...product, id: product.id.toString(), name, image: product.image_url}} />
      )}
      <BuyNowButton product={{...product, id: product.id.toString(), name, image: product.image_url}} />
    </div>
  );
};

export default React.memo(ProductControls);
