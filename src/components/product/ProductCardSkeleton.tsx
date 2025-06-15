
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Animated skeleton/fallback for a loading product card.
 */
const ProductCardSkeleton: React.FC = () => (
  <div className="lux-card p-4 flex flex-col max-w-xs w-full mx-auto h-full relative" style={{ minHeight: 340, borderRadius: 8, margin: 10, padding: 16 }}>
    <Skeleton className="w-full h-40 rounded mb-3" />
    <div className="mb-2">
      <Skeleton className="h-5 w-2/3 mb-1" />
      <Skeleton className="h-4 w-4/5 mb-1" />
      <Skeleton className="h-5 w-1/3" />
    </div>
    <Skeleton className="mt-3 h-11 w-full rounded" />
  </div>
);
export default ProductCardSkeleton;
