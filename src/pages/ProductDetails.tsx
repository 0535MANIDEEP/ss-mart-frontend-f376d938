import { useCartStore } from "@/store/cartStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import QuantitySelector from "@/components/QuantitySelector";
import ProductImage from "@/components/ProductImage";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

// Helper for translated fields
function getProductField(
  data: any,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang] || data.en || fallback;
}

const DopamineConfirm = () => (
  <div className="flex items-center gap-2">
    <span className="animate-pulse">✅</span>
    <span className="font-semibold text-lux-gold">Added to cart!</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const items = useCartStore(state => state.items);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const imgRef = useRef<HTMLImageElement>(null);
  const { user, role } = useSupabaseAuth();

  const cartItem = items.find(i => i._id === id?.toString());
  const stock = product?.stock ?? 0;
  const [qty, setQty] = useState<number>(cartItem?.quantity || 1);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    }).catch(() => {
      setProduct(null);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setQty(cartItem?.quantity || 1);
  }, [cartItem?.quantity, items.length]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16 text-gray-700">{t("productNotFound")}</div>;

  // --- Translations for local fields per language
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  // --- Componentized cart actions
  const cartProduct = {
    id: product.id,
    name: name,
    price: product.price,
    stock: product.stock,
    image: product.image,
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6 animate-fade-in">
      <ProductImage src={product.image} alt={name} size="large" className="mb-4" />
      <h2 className="text-2xl font-bold mb-2 truncate">{name}</h2>
      <p className="text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-line break-words">{desc}</p>
      <div className="flex items-center mb-4 gap-4">
        <span className="text-green-700 text-xl font-bold">₹{product.price}</span>
        <span className="text-xs bg-lux-gold/10 text-lux-gold border rounded-full px-3 py-1 ml-3">{product.category}</span>
        <span className="ml-6 text-sm text-gray-500">{t("stock", { count: product.stock })}</span>
      </div>
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
        <AddToCartButton product={cartProduct} />
        <BuyNowButton product={cartProduct} />
      </div>
      {/* Reviews */}
      {role === "guest"
        ? (
          <div className="my-6 text-gray-500 bg-yellow-50 border-l-4 border-yellow-300 py-2 px-4 rounded">
            {t("login")} to leave a review.
          </div>
        )
        : <ProductReviews productId={product?.id?.toString()} />
      }
    </div>
  );
};

export default ProductDetails;

// Note to user: src/pages/ProductDetails.tsx is getting quite lengthy. Consider asking for a refactor soon!
