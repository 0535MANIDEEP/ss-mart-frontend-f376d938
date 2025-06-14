import { useCartStore } from "@/store/cartStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DopamineConfirm = () => (
  <div className="flex items-center gap-2">
    <span className="animate-pulse">✅</span>
    <span className="font-semibold text-lux-gold">Added to cart!</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const items = useCartStore(state => state.items);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cartItem = items.find(i => i._id === id?.toString());
  const [qty, setQty] = useState(cartItem?.quantity || 1);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    }).catch(() => {
      setProduct(null);
    }).finally(() => setLoading(false));
    // Keep cart sync in view
    setQty(cartItem?.quantity || 1);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    setQty(cartItem?.quantity || 1);
    // eslint-disable-next-line
  }, [cartItem?.quantity]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16 text-gray-700">Product not found.</div>;

  const onAdd = () => {
    addToCart({
      _id: product.id?.toString(),
      name: product.name,
      price: product.price,
      quantity: qty,
      stock: product.stock,
      image: product.image,
    }, qty);
    toast({
      duration: 1350,
      title: <DopamineConfirm />,
      variant: "default"
    });
  };

  const handleBuyNow = () => {
    onAdd();
    setTimeout(() => {
      navigate("/cart");
    }, 250);
  };

  // Quantity zone
  const handleInc = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  const handleDec = () => {
    if (qty > 1) setQty(qty - 1);
    else if (qty === 1 && cartItem) {
      removeFromCart(product.id?.toString());
      toast({
        duration: 1000,
        title: <div className="flex items-center gap-2"><Minus size={16} className="inline text-red-600" />Removed from cart</div>,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6 animate-fade-in">
      <img src={product.image || "https://placehold.co/400x250"} alt={product.name} className="w-full h-64 object-cover rounded mb-4"/>
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex items-center mb-4 gap-4">
        <span className="text-green-700 text-xl font-bold">₹{product.price}</span>
        <span className="text-xs bg-lux-gold/10 text-lux-gold border rounded-full px-3 py-1 ml-3">{product.category}</span>
        <span className="ml-6 text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="flex items-center gap-4 my-4">
        {/* Quantity selector */}
        <Button variant="ghost" size="icon" aria-label="Decrease" onClick={handleDec} disabled={qty <= 1}>
          <Minus size={18} />
        </Button>
        <span className="text-lg font-semibold px-3">{qty}</span>
        <Button variant="ghost" size="icon" aria-label="Increase" onClick={handleInc} disabled={qty >= product.stock}>
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={onAdd}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex gap-2 items-center text-base font-semibold shadow"
        >
          <ShoppingCart size={20} /> Add to Cart
        </Button>
        <Button
          onClick={handleBuyNow}
          className="bg-lux-gold text-black px-4 py-2 rounded hover:bg-amber-400 transition flex gap-2 items-center text-base font-bold shadow"
        >
          Buy Now →
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
