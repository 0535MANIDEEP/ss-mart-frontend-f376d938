
import { useCartStore } from "@/store/cartStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col hover:scale-105 transition w-full max-w-xs mx-auto">
      <Link to={`/products/${product._id}`}>
        <img src={product.image || "https://placehold.co/300x200"} alt={product.name} className="w-full h-40 object-cover rounded"/>
      </Link>
      <h3 className="text-lg font-semibold mt-3 mb-1">{product.name}</h3>
      <p className="text-gray-700 flex-1">{product.description?.slice(0, 56) || "No description"}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-green-700 font-bold text-lg">₹{product.price}</span>
        <button
          onClick={() => addToCart(product, 1)}
          className="bg-green-500 text-white rounded px-4 py-1 hover:bg-green-600 transition shadow hover:scale-105"
        >Add</button>
      </div>
    </div>
  );
};

export default ProductCard;
