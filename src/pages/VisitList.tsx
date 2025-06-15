
import { useCartStore } from "@/store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuantitySelector from "@/components/QuantitySelector";
import { Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DownloadVisitSummary from "@/components/DownloadVisitSummary";

const VisitList = () => {
  const items = useCartStore(state => state.items);
  const remove = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clear = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtotal = Array.isArray(items)
    ? items.reduce((s, i) => s + (i.price * i.quantity), 0)
    : 0;
  const total = subtotal;

  if (!Array.isArray(items) || !items.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-2">Your In-Store Reservation Summary is Empty</h2>
        <Link to="/" className="text-green-600 underline">Browse & Reserve Now</Link>
      </div>
    );
  }

  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1) {
      remove(item._id);
      toast({
        duration: 1000,
        title: "Removed from Visit List",
        description: (
          <div className="flex items-center gap-2">
            <Minus size={16} className="inline text-red-600" />
            Removed from Visit List
          </div>
        ),
        variant: "destructive"
      });
    } else {
      updateQuantity(item._id, newQty);
    }
  };

  // Download visit list as JSON utility
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ssmart-visit-list.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1500);
  };

  return (
    <div className="container max-w-3xl mx-auto mt-6 animate-fade-in bg-white dark:bg-[#222230] p-4 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-lux-gold">Your In-Store Reservation Summary</h2>
      <p className="text-sm text-gray-500 mt-1">
        Please show this summary at SS MART, Shankarpally counter to complete your purchase.
      </p>
      <table className="w-full text-left overflow-x-auto mt-4">
        <thead>
          <tr className="border-b border-gray-300 dark:border-[#FFD70033]">
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border-b border-gray-100 dark:border-[#FFD70022]">
              <td className="py-2 flex items-center gap-3 min-w-[120px]">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=40&q=80"} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded-md bg-gray-100 dark:bg-[#292848]" 
                  style={{ borderRadius: 8 }}
                  onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=40&q=80")}
                />
                <span className="break-all dark:text-lux-gold">{item.name}</span>
              </td>
              <td>
                <div className="flex gap-2 items-center">
                  <QuantitySelector
                    quantity={item.quantity}
                    stock={item.stock}
                    onInc={() => handleQuantityChange(item, item.quantity + 1)}
                    onDec={() => handleQuantityChange(item, item.quantity - 1)}
                    disabled={item.stock === 0}
                  />
                </div>
              </td>
              <td>₹{item.price * item.quantity}</td>
              <td>
                <button
                  onClick={() => remove(item._id)}
                  className="text-red-600 hover:underline dark:text-red-400"
                  style={{ minHeight: 44 }}
                  tabIndex={0}
                  aria-label="Remove"
                >Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <strong className="text-xl dark:text-lux-gold">Estimated Total: ₹{total}</strong>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={clear}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-red-100 mr-1 whitespace-nowrap dark:bg-[#FFD70021] dark:text-lux-gold dark:hover:bg-[#FFD70066]"
            style={{ minHeight: 44, borderRadius: 8 }}
            tabIndex={0}
          >
            Clear Visit List
          </button>
          <DownloadVisitSummary items={items} total={total} />
          <button
            onClick={handleDownloadJSON}
            className="bg-[#FFD70033] text-[#232336] border border-[#FFD70088] font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#FFD70055] dark:bg-[#FFD70033] dark:text-[#FFD700] dark:border-[#FFD700aa]"
            style={{ borderRadius: 8 }}
            type="button"
            tabIndex={0}
            aria-label="Download Visit List JSON"
          >
            🗄️ Download Visit List JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
