
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import "./styles/index.css";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
import WishlistButton from "@/components/WishlistButton";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./productCardVariants";
import { Button } from "@/components/ui/button";
import ProductQuickView from "@/components/ProductQuickView";
import ProductImage from "./ProductImage";
import AddToCartButton from "@/components/AddToCartButton";
import { useCartStore } from "@/store/cartStore";

export type MultiLang = { en: string; hi?: string; te?: string };

// Ensures codebase-wide interface is used
export interface ProductCardProps {
  product: any;
  onClick?: (prod: any) => void;
}

// Helper: gets field per locale, fallback safe
function getProductField(
  data: MultiLang | string | undefined,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang as keyof MultiLang] || data.en || fallback;
}

// Fallback placeholder if image is missing/invalid URL
function getPlaceholderImage() {
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t, i18n } = useTranslation();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { items: cartItems, addToCart } = useCartStore();
  const [open, setOpen] = React.useState(false);

  // Cart item, reused everywhere
  const cartItem = cartItems.find(
    (item: any) => item._id === product.id?.toString()
  );
  // Show zero as min at first, but not less
  const [qty, setQty] = React.useState(0);

  // Reset qty to 0 when added OR when cartItem changes (for this product)
  React.useEffect(() => {
    if (cartItem) setQty(0);
  }, [cartItem?.quantity, product.id]);

  React.useEffect(() => {
    useWishlistStore.getState().fetchWishlist(user);
  }, [user]);

  // Universal translation for name and description
  const lang = i18n.language || "en";
  const name = t(product.name) || getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = t(product.description) || getProductField(product.description, lang, t("noDescription") || "No desc");
  const isOutOfStock = product.stock <= 0;

  // Add to Cart: Only works if qty > 0, resets qty after, fires toast
  const handleAddToCart = () => {
    if (qty > 0) {
      addToCart({
        _id: product.id.toString(),
        name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image: product.image_url || getPlaceholderImage(),
      }, qty);

      toast({
        duration: 1400,
        title: t("addedToCart"),
        description: (
          <div className="flex items-center gap-2">
            <span className="animate-pulse">✅</span>
            <span className="font-semibold">{name} ({qty})</span>
          </div>
        ),
        variant: "default",
      });

      setQty(0);
    }
  };

  const goToProductPage = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const showGuidance = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: t("productInteractionHint"),
      description: t(
        "Click product image/name for full details. Adjust quantity, then tap 'Add to Cart'."
      ),
    });
  };

  // Use fallback image if image_url is empty
  const productImage = product.image_url || getPlaceholderImage();

  return (
    <>
      <motion.div
        className="product-card-root group hover:scale-[1.025] focus-within:scale-[1.025] transition-transform outline-none bg-ssblue-card dark:bg-ssblue-primary border border-ssblue-secondary dark:border-ssblue-accent rounded-xl"
        style={{ minHeight: 420, boxShadow: "none" }}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate="rest"
        variants={cardVariants}
        tabIndex={0}
        aria-label={t("viewDetails")}
        role="article"
        onClick={() => { setOpen(true); if (onClick) onClick(product); }}
        onKeyDown={e => {
          if (e.key === "Enter") { setOpen(true); if (onClick) onClick(product);}
          else if (e.key === "?") showGuidance(e);
        }}
        data-testid="product-card"
      >
        {/* Top edge overlays */}
        <div className="product-card-top-edges">
          <ProductOutOfStockLabel stock={product.stock} />
          <WishlistButton productId={typeof product.id === "string" ? parseInt(product.id) : product.id} />
        </div>
        <div
          className="product-card-image group-hover:scale-[1.01] group-hover:border-ssblue-accent transition-all"
          tabIndex={0}
          aria-label={name}
          role="button"
          title={name}
          onClick={goToProductPage}
          onKeyDown={e => {
            if (e.key === "Enter") goToProductPage(e);
          }}
        >
          {/* Product image with fallback */}
          <img
            src={productImage}
            onError={e => (e.currentTarget.src = getPlaceholderImage())}
            alt={name}
            className="object-cover w-full h-full"
            style={{ height: "100%", width: "100%", borderRadius: "1.1rem 1.1rem 0 0" }}
            draggable={false}
            loading="lazy"
          />
        </div>
        <div className="product-card-info">
          <h3
            className="font-bold truncate text-lg card-title focus:underline cursor-pointer text-ssblue-primary dark:text-ssblue-onblue"
            title={name}
            tabIndex={0}
            aria-label={name}
            onClick={e => {
              e.stopPropagation();
              setOpen(true);
            }}
            style={{
              minHeight: 32,
              textShadow: "none"
            }}
          >
            {name || <span className="text-red-600">{t("noDescription")}</span>}
          </h3>
          <p className="product-card-desc text-ssblue-primary/70 dark:text-ssblue-onblue/80 font-medium text-[.98rem]">
            {desc || <span className="text-red-600">{t("noDescription")}</span>}
          </p>
          <div className="flex items-center justify-between mt-1 gap-2">
            <span className="text-ssblue-primary font-bold text-lg dark:text-ssblue-accent">{`₹${product.price}`}</span>
            <span
              className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${isOutOfStock
                  ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600/40"
                  : "bg-green-50 text-green-700 border border-green-200 dark:bg-ssblue-secondary/30 dark:text-ssblue-accent dark:border-ssblue-accent/40"}
              `}
              style={{ minWidth: 85, textAlign: "center" }}
            >
              {isOutOfStock ? t("outOfStock") : t("inStock")}
            </span>
          </div>
          {/* Remove card controls shadow */}
          <div className="product-card-controls">
            {!isOutOfStock ? (
              <div className="qty-atc-row" onClick={e => e.stopPropagation()}>
                <button
                  aria-label={t("subtract")}
                  className="qty-btn hover:scale-110 transition-transform"
                  type="button"
                  disabled={qty === 0}
                  tabIndex={0}
                  style={{
                    background: "#EFF6FF",
                    color: "#1E3A8A",
                    border: "1.5px solid #3B82F6",
                    boxShadow: "none"
                  }}
                  onClick={() => setQty(q => (q > 0 ? q - 1 : 0))}
                >
                  <Minus size={20} />
                </button>
                <span className="qty-count" aria-live="polite" tabIndex={0}>{qty}</span>
                <button
                  aria-label={t("add")}
                  className="qty-btn hover:scale-110 transition-transform"
                  type="button"
                  disabled={qty >= product.stock}
                  tabIndex={0}
                  style={{
                    background: "#1E3A8A",
                    color: "#F9FAFB",
                    border: "1.5px solid #3B82F6",
                    boxShadow: "none"
                  }}
                  onClick={() => setQty(q => Math.min(q + 1, product.stock))}
                >
                  <Plus size={20} />
                </button>
                {/* Reserve in Store */}
                {qty > 0 && (
                  <Button
                    size="default"
                    className="bg-ssblue-primary text-ssblue-onblue rounded-md px-3 py-1 mt-2 hover:bg-ssblue-secondary focus-visible:ring-2 focus-visible:ring-ssblue-accent focus:outline-none dark:bg-ssblue-secondary dark:hover:bg-ssblue-accent dark:text-ssblue-onblue"
                    aria-label={t("reserveInStore") || "Reserve in Store"}
                    onClick={e => {
                      e.stopPropagation();
                      addToCart({
                        _id: product.id.toString(),
                        name,
                        price: product.price,
                        quantity: qty,
                        stock: product.stock,
                        image: product.image_url || getPlaceholderImage(),
                      }, qty);

                      toast({
                        duration: 1400,
                        title: t("addedToCart"),
                        description: (
                          <div className="flex items-center gap-2">
                            <span className="animate-pulse">✅</span>
                            <span className="font-semibold">{name} ({qty})</span>
                          </div>
                        ),
                        variant: "default",
                      });

                      setQty(0);
                    }}
                    type="button"
                    disabled={isOutOfStock || product.stock < 1}
                    tabIndex={0}
                    style={{ minHeight: 44, borderRadius: 8, marginLeft: 8, boxShadow: "none" }}
                  >
                    {t("reserveInStore") || "Reserve in Store"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="out-of-stock-text text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                {t("outOfStock")}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="view-product-btn bg-ssblue-card dark:bg-ssblue-secondary text-ssblue-primary dark:text-ssblue-onblue border border-ssblue-secondary dark:border-ssblue-accent hover:bg-ssblue-secondary dark:hover:bg-ssblue-accent dark:hover:text-ssblue-primary"
            onClick={goToProductPage}
            aria-label={t("viewDetails")}
            tabIndex={0}
            type="button"
            style={{ boxShadow: "none" }}
          >
            {t("viewDetails")}
          </Button>
        </div>
      </motion.div>
      {open && (
        <ProductQuickView
          product={product}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
