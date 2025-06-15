
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./product/ProductCard";
import { useTranslation } from "react-i18next";

type Product = {
  id: number | string;
  name: any;
  description: any;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

interface ProductGridProps {
  products: Product[];
  onCardClick: (product: Product) => void;
}

const gridVariants = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, onCardClick }) => {
  const { t } = useTranslation();

  // Debug: clearly log render and product count
  console.log("[ProductGrid] Rendering, product count:", products?.length);

  if (!products || products.length === 0) {
    return (
      <motion.div
        className="text-gray-700 text-center my-16 text-xl bg-yellow-50 border border-yellow-300 rounded-xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-live="polite"
      >
        <div>🔎 <span className="font-semibold">{t("noProducts") || "No products found."}</span></div>
        <div className="mt-2 text-xs text-gray-600">
          If you expected to see products, open developer tools (F12), check <b>Network</b> and <b>Console</b>:<br />
          <span className="bg-lux-gold/20 px-2 rounded font-mono">Fetched Products</span> <span className="font-mono">/</span> <span className="bg-lux-gold/20 px-2 rounded font-mono">Fetch Products Error</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 animate-fade-in bg-white/95 dark:bg-lux-black min-h-[200px] rounded-2xl border border-yellow-400 p-4"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: "200px" }}
      data-testid="product-grid"
    >
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.55 } }
            }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.3 } }}
            className="min-h-[340px] flex flex-col justify-end"
            style={{ background: "rgba(255,236,153,0.14)" }}
            data-testid={`product-grid-item-${product.id}`}
          >
            <ProductCard product={product} onClick={() => onCardClick(product)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
