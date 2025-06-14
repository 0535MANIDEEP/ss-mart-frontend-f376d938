
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const cart = useCartStore(state => state.items);
  const { isAuthenticated, logout } = useAuthStore();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow w-full px-8 py-3 z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold text-green-600 tracking-wide">SS MART</Link>
      </div>
      <div className="flex items-center gap-6 text-lg">
        <Link to="/cart" className="relative group">
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-green-500 text-white rounded-full px-2 text-xs animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
          </>
        ) : (
          <Link to="/admin/login" className={location.pathname === "/admin/login" ? "font-bold text-green-600" : ""}>Admin Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
