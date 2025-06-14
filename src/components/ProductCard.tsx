
import { FC } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// Strict type for product props (future-friendly)
type Product = {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

const cardVariants = {
  rest: { scale: 1, rotateX: 0, rotateY: 0, boxShadow: "0 2px 20px 0 rgba(255, 215, 0, 0.10)" },
  hover: {
    scale: 1.044,
    rotateX: -7,
    rotateY: 9,
    boxShadow: "0 8px 35px 2px rgba(255, 215, 0, 0.18), 0 1.2px 24px #FFD70025",
    transition: { type: "spring" as const, stiffness: 410, damping: 30 }
  },
  tap: {
    scale: 0.98,
    rotateX: 1,
    rotateY: -2,
    boxShadow: "0 2px 18px 0 rgba(255, 215, 0, 0.14)",
    transition: { type: "spring" as const, stiffness: 310 }
  }
};

const DopamineConfirm = () => (
  <div className="flex items-center gap-2">
    <span className="animate-pulse">✅</span>
    <span className="font-semibold text-lux-gold">Added to cart!</span>
  </div>
);

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const updateQty = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const items = useCartStore(s => s.items);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Defensive: prop types check for shape
  if (!product || typeof product.id !== "number" && typeof product.id !== "string") {
    return <div className="text-red-500 text-center p-2">Invalid product data.</div>;
  }

  const cartItem = items.find(i => i._id === product.id?.toString());
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addToCart({
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      image: product.image_url || undefined,
    });
    toast({
      duration: 1250,
      title: t("addedToCart"),
      description: <DopamineConfirm />,
      variant: "default"
    });
  };

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

  // "Buy Now": add 1 to cart (or update) then go to /checkout
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) {
      addToCart({
        _id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        image: product.image_url || undefined,
      });
    } else {
      updateQty(product.id.toString(), quantity > 0 ? quantity : 1);
    }
    navigate("/checkout");
  };

  const toDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      className="lux-card group hover:scale-105 transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform cursor-pointer bg-white dark:bg-lux-black"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={t("viewDetails")}
      role="article"
      onClick={toDetails}
    >
      <motion.img
        src={product.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=70"}
        alt={product.name}
        loading="lazy"
        className="rounded-t-lg w-full h-40 object-cover mb-3 bg-gradient-to-b from-lux-gold/40 to-gray-200/10 shadow cursor-pointer group-hover:scale-105"
        style={{ transition: "transform 0.18s,cubic-bezier(0.4,0,0.2,1)" }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        tabIndex={0}
        aria-label={t("viewDetails")}
      />
      <h3
        className="text-lg font-semibold mb-1 truncate text-lux-black dark:text-lux-gold cursor-pointer group-hover:underline"
        onClick={e => { e.stopPropagation(); toDetails(); }}
        tabIndex={0}
      >
        {product.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-200 flex-1 mb-2 text-sm">{product.description?.slice(0, 56) || t("noDescription") || "No description"}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
        <div className="flex gap-1 items-center">
          {/* Quantity controls if in cart */}
          {quantity > 0 ? (
            <motion.div className="flex items-center border rounded-xl px-2 py-1 bg-white/90 dark:bg-lux-black/80 shadow-sm gap-1" layout aria-label={t("quantity")}>
              <Button size="icon" variant="ghost" onClick={handleDec} className="!p-2.5" aria-label={t("subtract")} tabIndex={0}>
                <Minus size={20} />
              </Button>
              <span className="font-semibold text-green-700 px-1 text-base">{quantity}</span>
              <Button size="icon" variant="ghost" onClick={handleInc} disabled={quantity >= product.stock} className="!p-2.5" aria-label={t("add")} tabIndex={0}>
                <Plus size={20} />
              </Button>
            </motion.div>
          ) : (
            <motion.button
              className="lux-btn text-base relative overflow-hidden focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
              aria-label={t("addToCart")}
              onClick={e => { e.stopPropagation(); handleAdd(); }}
              whileTap={{ scale: 0.96 }}
              whileHover={{
                boxShadow: "0 3px 18px 2px #FFD700, 0 0px 8px #FFD70077",
                background: "#FFD700",
              }}
              tabIndex={0}
            >
              <span className="relative z-20 pointer-events-none flex items-center gap-1">
                <ShoppingCart size={18} /> {t("addToCart")}
              </span>
              <motion.span
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ borderRadius: "inherit" }}
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 1,
                  background: "radial-gradient(circle at 60% 40%, #ffd70066 10%, #FFD70022 45%, transparent 60%)"
                }}
                transition={{ type: "tween", duration: 0.33 }}
                aria-hidden="true"
              />
            </motion.button>
          )}
          {/* Buy Now, big touch target, clear aria */}
          <Button
            size="sm"
            variant="secondary"
            className="ml-2 bg-white dark:bg-lux-black border border-gray-200 hover:bg-amber-100/80 shadow transition-all min-w-[64px] !py-2"
            onClick={handleBuyNow}
            aria-label={t("buyNow")}
            type="button"
            tabIndex={0}
          >
            {t("buyNow")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

