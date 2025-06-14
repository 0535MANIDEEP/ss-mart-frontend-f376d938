
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "@/routes";
import type { Product } from "./ProductCard";

type Props = {
  product: Product;
  name: string;
};

const fallback = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=70";

const ProductImage = React.memo(({ product, name }: Props) => (
  <Link
    to={ROUTES.PRODUCT(product.id.toString())}
    tabIndex={0}
    aria-label={name}
    title={name}
    className="block"
    style={{ textDecoration: "none", color: "inherit" }}
    onClick={e => e.stopPropagation()}
  >
    <motion.img
      src={product.image_url || fallback}
      alt={name}
      loading="lazy"
      className="object-cover bg-gradient-to-b from-lux-gold/40 to-gray-200/10 shadow rounded w-full h-40 mb-3"
      onError={e => (e.currentTarget.src = fallback)}
      tabIndex={0}
      aria-label={name}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 100 }}
    />
  </Link>
));

export default ProductImage;
