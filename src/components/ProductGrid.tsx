
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

  if (!products.length) {
    return (
      <motion.div
        className="text-gray-500 text-center my-14 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-live="polite"
      >
        {t("noProducts")}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 animate-fade-in"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
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
          >
            <ProductCard product={product} onClick={() => onCardClick(product)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
