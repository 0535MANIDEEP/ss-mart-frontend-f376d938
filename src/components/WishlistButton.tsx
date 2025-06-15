
import React from "react";
import { Heart, HeartOff } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { cn } from "@/lib/utils";

type Props = {
  productId: number;
  size?: number;
};

const WishlistButton: React.FC<Props> = ({ productId, size = 22 }) => {
  const { user } = useSupabaseAuth();
  const { items, addToWishlist, removeFromWishlist, loading } = useWishlistStore();
  const isInWishlist = !!items.find(w => w.product_id === productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (isInWishlist) removeFromWishlist(user, productId);
    else addToWishlist(user, productId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "p-2 rounded-full transition hover:bg-red-50/70 focus:outline-none focus:ring-2 focus:ring-red-400 border border-transparent",
        isInWishlist
          ? "text-red-600 hover:text-red-700 bg-red-100"
          : "text-gray-400 hover:text-red-400"
      )}
      disabled={loading || !user}
      tabIndex={0}
      title={!user ? "Login to use wishlist" : isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      style={{ lineHeight: 1 }}
    >
      {isInWishlist ? <HeartOff size={size} /> : <Heart size={size} />}
    </button>
  );
};

export default WishlistButton;

