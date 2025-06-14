
import { useCartStore } from "@/store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const items = useCartStore(state => state.items);
  const remove = useCartStore(state => state.removeFromCart);
  const update = useCartStore(state => state.updateQuantity);
  const clear = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);

  if (!items.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-2">{t("emptyCart")}</h2>
        <Link to="/" className="text-green-600 underline">{t("shopNow")}</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto mt-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">{t("yourCart")}</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-300">
            <th>{t("product")}</th>
            <th>{t("quantity")}</th>
            <th>{t("price")}</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border-b border-gray-100">
              <td className="py-2 flex items-center gap-3">
                <img src={item.image || "https://placehold.co/40x40"} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <span>{item.name}</span>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={item.stock || 20}
                  value={item.quantity}
                  onChange={e => update(item._id, +e.target.value)}
                  className="w-16 border px-2 py-1 rounded"
                  aria-label={t("quantity")}
                />
              </td>
              <td>₹{item.price * item.quantity}</td>
              <td>
                <button onClick={() => remove(item._id)} className="text-red-600 hover:underline">{t("remove")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <strong className="text-xl">{t("total")}: ₹{total}</strong>
        <div className="flex gap-2">
          <button onClick={clear} className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-red-100 mr-1">{t("clearCart")}</button>
          <button onClick={() => navigate("/checkout")} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow">{t("checkout")}</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
