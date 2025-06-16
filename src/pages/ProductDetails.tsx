
import { useCartStore } from "@/store/cartStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";
import { useTranslation } from "react-i18next";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ReviewSection from "@/components/ReviewSection";

function getProductField(
  data: any,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang] || data.en || fallback;
}

const ProductDetails = () => {
  const { id } = useParams();
  const items = useCartStore(state => state.items);
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { t, i18n } = useTranslation();
  const { user, role } = useSupabaseAuth();
  const navigate = useNavigate();

  const cartItem = items.find(i => i._id === id?.toString());

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
  }, [cartItem?.quantity]);

  if (loading) return <Loader />;
  if (!product) return (
    <div className="text-center py-16 text-gray-700 dark:text-gray-300">
      {t("productNotFound")}
    </div>
  );

  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  const handleAddToCart = () => {
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
      name,
      price: product.price,
      quantity: qty,
      stock: product.stock,
      image: product.image || product.image_url,
    }, qty);

    toast({
      duration: 1000,
      title: t("addedToCart"),
      description: (
        <div className="flex items-center gap-2">
          <span className="animate-pulse">✅</span>
          <span className="font-semibold text-ssblue-primary">
            {t("addedToCart")}
          </span>
        </div>
      ),
      variant: "default"
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/checkout"), 200);
  };

  const handleInc = () => {
    if (qty < product.stock) {
      const newQty = qty + 1;
      setQty(newQty);
      if (cartItem) updateQty(product.id?.toString(), newQty);
    }
  };

  const handleDec = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);
      if (cartItem) updateQty(product.id?.toString(), newQty);
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
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ssblue-card via-gray-50 to-green-50 dark:from-ssblue-primary dark:via-gray-950 dark:to-green-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-ssblue-primary rounded-xl border border-ssblue-secondary dark:border-ssblue-accent p-6 shadow-lg animate-fade-in">
          {/* Product Image */}
          <div className="mb-6">
            <ProductImage 
              src={product.image || product.image_url} 
              alt={name} 
              size="large" 
              className="w-full h-80 object-cover rounded-lg border border-ssblue-secondary dark:border-ssblue-accent"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-ssblue-primary dark:text-ssblue-onblue">
              {name}
            </h1>
            
            <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
              {desc}
            </p>

            {/* Price and Stock */}
            <div className="flex items-center justify-between py-4 border-y border-ssblue-secondary dark:border-ssblue-accent">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-ssblue-primary dark:text-ssblue-accent">
                  ₹{product.price}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-ssblue-accent/20 text-ssblue-primary dark:bg-ssblue-secondary/30 dark:text-ssblue-accent border border-ssblue-accent/40">
                  {product.category}
                </span>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                isOutOfStock 
                  ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300"
              }`}>
                {isOutOfStock ? t("outOfStock") : `${t("stock", { count: product.stock })}`}
              </span>
            </div>

            {/* Quantity Controls */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 py-4">
                <span className="font-medium text-ssblue-primary dark:text-ssblue-onblue">
                  {t("quantity")}:
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDec}
                    disabled={qty <= 1 && !cartItem}
                    className="h-10 w-10 rounded-lg border-ssblue-secondary text-ssblue-primary hover:bg-ssblue-accent/20 dark:border-ssblue-accent dark:text-ssblue-accent flex items-center justify-center"
                  >
                    <Minus size={16} className="flex-shrink-0" />
                  </Button>
                  <span className="text-xl font-medium min-w-[3rem] text-center text-ssblue-primary dark:text-ssblue-onblue">
                    {qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleInc}
                    disabled={qty >= product.stock}
                    className="h-10 w-10 rounded-lg border-ssblue-secondary text-ssblue-primary hover:bg-ssblue-accent/20 dark:border-ssblue-accent dark:text-ssblue-accent flex items-center justify-center"
                  >
                    <Plus size={16} className="flex-shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOutOfStock && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={qty < 1}
                  className="flex-1 h-12 text-lg font-semibold bg-ssblue-primary text-ssblue-onblue hover:bg-ssblue-secondary dark:bg-ssblue-secondary dark:hover:bg-ssblue-accent dark:text-ssblue-onblue"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {t("addToCart")}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={qty < 1}
                  variant="outline"
                  className="flex-1 h-12 text-lg font-semibold border-ssblue-secondary text-ssblue-primary hover:bg-ssblue-accent/20 dark:border-ssblue-accent dark:text-ssblue-accent dark:hover:bg-ssblue-accent/30"
                >
                  {t("buyNow")}
                </Button>
              </div>
            )}

            {/* Out of Stock Message */}
            {isOutOfStock && (
              <div className="text-center py-6">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg border border-red-200 dark:border-red-600/40">
                  <p className="text-lg font-medium">{t("outOfStock")}</p>
                  <p className="text-sm mt-1">{t("This product is currently unavailable")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-8 pt-8 border-t border-ssblue-secondary dark:border-ssblue-accent">
            <ReviewSection role={role} productId={product?.id?.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
