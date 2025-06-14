import { FC } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

  // This cart logic matches CartItem type: our backend uses 'id', cart uses '_id'
  const cartItem = items.find(i => i._id === product.id?.toString());
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addToCart({
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      image: product.image_url,
    });
    toast({
      duration: 1250,
      title: <DopamineConfirm />,
      variant: "default"
    });
  };

  const handleInc = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ((quantity ?? 0) < product.stock) {
      updateQty(product.id.toString(), (quantity ?? 0) + 1);
      toast({
        duration: 900,
        variant: "default",
        title: <div className="flex items-center gap-2">
            <Plus size={16} className="inline text-green-600" />
            <span>Added another!</span>
          </div>
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
        title: <div className="flex items-center gap-2"><Minus size={16} className="inline text-red-600" />Removed from cart</div>,
        variant: "destructive"
      });
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const toDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      className="lux-card group hover:scale-105 transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      role="article"
      onClick={toDetails}
    >
      <motion.img
        src={product.image_url || "https://placehold.co/300x200"}
        alt={product.name}
        className="rounded-t-lg w-full h-40 object-cover mb-3 bg-gradient-to-b from-lux-gold/40 to-gray-200/10 shadow cursor-pointer group-hover:scale-105 transition"
        loading="lazy"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <h3
        className="text-lg font-semibold mb-1 truncate text-lux-black cursor-pointer group-hover:underline"
        onClick={e => { e.stopPropagation(); toDetails(); }}
      >
        {product.name}
      </h3>
      <p className="text-gray-500 flex-1 mb-2 text-sm">{product.description?.slice(0, 56) || "No description"}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
        <div className="flex gap-1 items-center">
          {/* Quantity controls if in cart */}
          {quantity > 0 ? (
            <motion.div className="flex items-center border rounded-xl px-2 py-1 bg-white/90 shadow-sm gap-1" layout>
              <Button size="icon" variant="ghost" onClick={handleDec} className="!p-1.5" aria-label="Decrease quantity">
                <Minus size={18} />
              </Button>
              <span className="font-semibold text-green-700 px-1 text-base">
                {quantity}
              </span>
              <Button size="icon" variant="ghost" onClick={handleInc} disabled={quantity >= product.stock} className="!p-1.5" aria-label="Increase quantity">
                <Plus size={18} />
              </Button>
            </motion.div>
          ) : (
            <motion.button
              className="lux-btn text-sm relative overflow-hidden focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
              aria-label={`Add ${product.name} to cart`}
              onClick={e => { e.stopPropagation(); handleAdd(); }}
              whileTap={{ scale: 0.96 }}
              whileHover={{
                boxShadow: "0 3px 18px 2px #FFD700, 0 0px 8px #FFD70077",
                background: "#FFD700",
              }}
            >
              <span className="relative z-20 pointer-events-none flex items-center gap-1">
                <ShoppingCart size={16} /> Add
              </span>
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
          )}
          {/* Buy Now */}
          <Button
            size="sm"
            variant="secondary"
            className="ml-2 bg-white border border-gray-200 hover:bg-amber-100/80 shadow transition-all"
            onClick={handleBuyNow}
            aria-label="Buy Now"
            type="button"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
