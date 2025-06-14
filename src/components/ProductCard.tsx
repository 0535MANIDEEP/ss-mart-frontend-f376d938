
import { FC } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="lux-card hover:scale-105 transition p-4 flex flex-col max-w-xs w-full mx-auto h-full">
      <img
        src={product.image_url || "https://placehold.co/300x200"}
        alt={product.name}
        className="rounded-t-lg w-full h-40 object-cover mb-3"
        loading="lazy"
      />
      <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
      <p className="text-gray-500 flex-1 mb-2 text-sm">{product.description?.slice(0, 56) || "No description"}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
        <button
          className="lux-btn text-sm"
          aria-label={`Buy ${product.name}`}
        >Add</button>
      </div>
    </div>
  );
};

export default ProductCard;
