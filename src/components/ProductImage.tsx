
import React from "react";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  size?: "small" | "medium" | "large";
};

const fallback = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=70";

export default function ProductImage({
  src,
  alt,
  className = "",
  size = "medium"
}: ProductImageProps) {
  let sizeCls = "";
  if (size === "small") sizeCls = "w-12 h-12";
  else if (size === "large") sizeCls = "w-full h-64";
  else sizeCls = "w-full h-40";

  return (
    <img
      src={src || fallback}
      alt={alt}
      loading="lazy"
      className={`object-cover bg-gradient-to-b from-lux-gold/40 to-gray-200/10 shadow rounded ${sizeCls} ${className}`}
      onError={e => (e.currentTarget.src = fallback)}
      tabIndex={0}
      aria-label={alt}
    />
  );
}
