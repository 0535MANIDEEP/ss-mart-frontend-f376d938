
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

type CartActionsProps = {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string;
  };
  cartItem: any;
};

export default function CartActions({ product, cartItem }: CartActionsProps) {
  const { t } = useTranslation();
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const [qty, setQty] = useState<number>(cartItem?.quantity || 1);

  useEffect(() => {
    setQty(cartItem?.quantity || 1);
  }, [cartItem?.quantity, cartItem?._id]);

  return (
    <>
      <div className="flex items-center gap-4 my-4">
        <QuantitySelector
          quantity={qty}
          stock={product.stock}
          onInc={() => {
            if (qty < product.stock) {
              setQty(qty + 1);
              if (cartItem) updateQty(product.id?.toString(), qty + 1);
            }
          }}
          onDec={() => {
            if (qty > 1) {
              setQty(qty - 1);
              if (cartItem) updateQty(product.id?.toString(), qty - 1);
            } else if (qty === 1 && cartItem) {
              removeFromCart(product.id?.toString());
              setQty(1);
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
          }}
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <AddToCartButton product={product} />
        <BuyNowButton product={product} />
      </div>
    </>
  );
}
