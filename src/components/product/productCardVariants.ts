
import type { Variants } from "framer-motion";

/**
 * Framer Motion variants for ProductCard animation.
 * Used for spring pop, hover and tap state.
 */
export const cardVariants: Variants = {
  rest: { scale: 1, boxShadow: "0 2px 20px 0 rgba(255,215,0,0.10)" },
  hover: {
    scale: 1.044,
    boxShadow: "0 8px 35px 2px #FFD7002E",
    transition: { type: "spring" as const, stiffness: 410, damping: 30 },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 2px 18px 0 #FFD70024",
    transition: { type: "spring" as const, stiffness: 310 },
  },
};
