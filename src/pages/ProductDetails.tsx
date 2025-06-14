
import { useCartStore } from "@/store/cartStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore(state => state.addToCart);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    }).catch(() => {
      setProduct(null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16 text-gray-700">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6 animate-fade-in">
      <img src={product.image || "https://placehold.co/400x250"} alt={product.name} className="w-full h-64 object-cover rounded mb-4"/>
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex items-center mb-4">
        <span className="text-green-700 text-xl font-bold">₹{product.price}</span>
        <span className="ml-6 text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={product.stock || 10}
          value={qty}
          onChange={e => setQty(+e.target.value)}
          className="border rounded px-2 py-1 w-16"
        />
        <button
          onClick={() => { addToCart(product, qty); navigate("/cart"); }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >Add to Cart &rarr;</button>
      </div>
    </div>
  );
};

export default ProductDetails;
