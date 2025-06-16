
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./product/productCardVariants";
import QuantitySelector from "./QuantitySelector";
import ReserveButton from "./ReserveButton";
import { useCartStore } from "@/store/cartStore";

// Minimal Product type for this card
type Product = {
  id: number | string;
  name: any;
  description: any;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

type ProductCardProps = {
  product: Product;
  onClick?: (prod: Product) => void;
};

function getProductField(data: any, lang: string, fallback: string = ""): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang] || data.en || fallback;
}

function getPlaceholderImage() {
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t, i18n } = useTranslation();
  const { items: cartItems } = useCartStore();
  const [qty, setQty] = React.useState(0);

  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");
  const isOutOfStock = product.stock <= 0;

  // Always use visit list (cart) logic; qty for display only
  React.useEffect(() => {
    if (isOutOfStock) setQty(0);
  }, [isOutOfStock, product.stock]);

  // Quick Details
  const productImage = product.image_url || getPlaceholderImage();

  return (
    <motion.div
      className="product-card-root group hover:scale-[1.025] hover:shadow-ssblue focus-within:scale-[1.025] transition-transform outline-none border border-ssblue-secondary bg-ssblue-card dark:bg-ssblue-primary dark:border-ssblue-accent"
      style={{ minHeight: 420 }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={t("viewDetails")}
      role="article"
      onClick={() => { if (onClick) onClick(product); }}
      data-testid="product-card"
    >
      <div
        className="product-card-image group-hover:shadow-ssblue transition-all"
        tabIndex={0}
        aria-label={name}
        title={name}
        style={{ cursor: "pointer" }}
      >
        <img
          src={productImage}
          alt={name}
          className="object-cover w-full h-full"
          style={{ height: "100%", width: "100%", borderRadius: "1.1rem 1.1rem 0 0" }}
          draggable={false}
          loading="lazy"
        />
      </div>
      <div className="product-card-info">
        <h3
          className="font-bold truncate text-lg card-title cursor-pointer text-ssblue-primary dark:text-ssblue-onblue"
          title={name}
          tabIndex={0}
          aria-label={name}
        >
          {name || <span className="text-red-600">No name</span>}
        </h3>
        <p className="product-card-desc text-ssblue-primary/90 dark:text-ssblue-onblue/80 font-medium">{desc || <span className="text-red-600">No desc</span>}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="text-ssblue-primary dark:text-ssblue-accent font-bold text-lg">₹{product.price}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${isOutOfStock
                ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600/40"
                : "bg-ssblue-accent/20 text-ssblue-primary border border-ssblue-accent/40 dark:bg-ssblue-secondary/30 dark:text-ssblue-accent dark:border-ssblue-accent/40"
              }`}
            style={{ minWidth: 85, textAlign: "center" }}
          >
            {isOutOfStock ? t("outOfStock") || "Out of Stock" : t("inStock") || "In Stock"}
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {!isOutOfStock && (
            <>
              <QuantitySelector
                quantity={qty}
                stock={product.stock}
                onInc={() => setQty(q => Math.min(q + 1, product.stock))}
                onDec={() => setQty(q => Math.max(q - 1, 0))}
                disabled={isOutOfStock}
              />
              <ReserveButton
                product={{
                  id: product.id,
                  name,
                  price: product.price,
                  stock: product.stock,
                  image: product.image_url,
                }}
                qty={qty}
                disabled={isOutOfStock || qty < 1}
                onReserved={() => setQty(0)}
              />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
