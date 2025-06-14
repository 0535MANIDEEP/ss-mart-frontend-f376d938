
import { Link } from "react-router-dom";

const OrderSuccess = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
    <h2 className="text-2xl font-bold text-green-600 mb-2">Order Sent!</h2>
    <p className="mb-4 text-gray-700">We’ve sent your order request via WhatsApp.<br />SS MART will confirm availability shortly.</p>
    <Link to="/" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Continue Shopping</Link>
  </div>
);

export default OrderSuccess;
