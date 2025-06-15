
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";

/**
 * Core helper for adding/reserving items in the visit list ("cart").
 * Usage: handleReserve(product, qty, productName)
 */
export function handleReserve(product: {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  image?: string | null | undefined;
}, qty: number) {
  const addToCart = useCartStore.getState().addToCart;
  if (!product || qty < 1) return;

  addToCart({
    _id: product.id.toString(),
    name: product.name,
    price: product.price,
    quantity: qty,
    stock: product.stock,
    image: product.image || undefined,
  }, qty);

  toast({
    duration: 1300,
    title: "Reserved! Show summary at SS MART",
    description: (
      <div className="flex items-center gap-2">
        <span className="animate-pulse">✅</span>
        <span className="font-semibold">{product.name} ({qty})</span>
      </div>
    ),
    variant: "default",
  });
}
