
import { FC } from "react";
import { motion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

const cardVariants = {
  rest: { scale: 1, rotateX: 0, rotateY: 0, boxShadow: "0 2px 20px 0 rgba(255, 215, 0, 0.10)" },
  hover: {
    scale: 1.044,
    rotateX: -7,
    rotateY: 9,
    boxShadow: "0 8px 35px 2px rgba(255, 215, 0, 0.18), 0 1.2px 24px #FFD70025",
    transition: { type: "spring", stiffness: 410, damping: 30 }
  },
  tap: {
    scale: 0.98,
    rotateX: 1,
    rotateY: -2,
    boxShadow: "0 2px 18px 0 rgba(255, 215, 0, 0.14)",
    transition: { type: "spring", stiffness: 310 }
  }
};

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div
      className="lux-card hover:scale-105 transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      role="article"
    >
      <motion.img
        src={product.image_url || "https://placehold.co/300x200"}
        alt={product.name}
        className="rounded-t-lg w-full h-40 object-cover mb-3 bg-gradient-to-b from-lux-gold/40 to-gray-200/10 shadow"
        loading="lazy"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <h3 className="text-lg font-semibold mb-1 truncate text-lux-black">{product.name}</h3>
      <p className="text-gray-500 flex-1 mb-2 text-sm">{product.description?.slice(0, 56) || "No description"}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
        <motion.button
          className="lux-btn text-sm relative overflow-hidden focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
          aria-label={`Buy ${product.name}`}
          whileTap={{ scale: 0.96 }}
          whileHover={{
            boxShadow: "0 3px 18px 2px #FFD700, 0 0px 8px #FFD70077",
            background: "#FFD700",
          }}
        >
          <span className="relative z-20 pointer-events-none">Add</span>
          {/* Neon Ripple */}
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
      </div>
    </motion.div>
  );
};

export default ProductCard;
