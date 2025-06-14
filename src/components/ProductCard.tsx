import { FC } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import QuantitySelector from "./QuantitySelector";
import ProductImage from "./ProductImage";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

// Strict type for translated product 
type MultiLang = { en: string; hi?: string; te?: string };
type Product = {
  id: number | string;
  name: MultiLang | string;
  description: MultiLang | string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

type ProductCardProps = {
  product: Product;
  onClick?: (prod: Product) => void;
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

// Support dynamic translation with fallback
function getProductField(
  data: MultiLang | string | undefined,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang as keyof MultiLang] || data.en || fallback;
}

const ProductCard: FC<ProductCardProps> = ({ product, onClick }) => {
  const addToCart = useCartStore(s => s.addToCart);
  const updateQty = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const items = useCartStore(s => s.items);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  if (!product || typeof product.id !== "number" && typeof product.id !== "string") {
    return <div className="text-red-500 text-center p-2">{t("productNotFound")}</div>;
  }

  // Translated name/desc
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

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

  const toDetails = () => {
    if (onClick) {
      onClick(product);
    } else {
      navigate(ROUTES.PRODUCT(product.id));
    }
  };

  return (
    <motion.div
      className="lux-card group hover:scale-105 transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform cursor-pointer bg-white dark:bg-lux-black"
      style={{
        minHeight: 340,
        borderRadius: 8,
        boxShadow: "0 2px 20px 0 rgba(255,215,0,0.10)",
        margin: "10px",
        padding: 16,
      }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={onClick ? undefined : t("viewDetails")}
      role="article"
      onClick={toDetails}
    >
      <Link
        to={ROUTES.PRODUCT(product.id)}
        onClick={e => e.stopPropagation()}
        tabIndex={0}
        aria-label={t("viewDetails")}
        title={name}
        className="block"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ProductImage src={product.image_url} alt={name} size="medium" className="mb-3" />
      </Link>
      <h3
        className="text-lg font-semibold mb-1 truncate text-lux-black dark:text-lux-gold cursor-pointer group-hover:underline"
        onClick={e => { e.stopPropagation(); navigate(ROUTES.PRODUCT(product.id)); }}
        tabIndex={0}
        title={name}
        style={{ marginBottom: 6 }}
      >
        {name}
      </h3>
      <p className="text-gray-500 dark:text-gray-200 flex-1 mb-2 text-sm truncate" title={desc} style={{ marginBottom: 6 }}>
        {desc.slice(0, 56) || t("noDescription") || "No description"}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
        <div className="flex gap-2 items-center flex-nowrap">
          {quantity > 0 ? (
              <QuantitySelector
                quantity={quantity}
                stock={product.stock}
                onInc={handleInc}
                onDec={handleDec}
              />
          ) : (
            <AddToCartButton product={{...product, id: product.id, name, image: product.image_url}} />
          )}
          <BuyNowButton product={{...product, id: product.id, name, image: product.image_url}} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

// Note to user: src/components/ProductCard.tsx is getting quite lengthy. Consider asking for a refactor soon!
