
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const items = useCartStore(state => state.items);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState<string>("Guest");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "admin") {
      setRole("Admin");
    } else if (storedRole) {
      setRole("User");
    } else {
      setRole("Guest");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow w-full px-4 sm:px-8 py-3 z-50 sticky top-0 transition">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold text-green-600 tracking-wide">
          SS MART
        </Link>
      </div>

      <div className="flex items-center gap-6 text-lg">
        <span className="text-sm italic hidden sm:inline-block">Logged in as: <strong>{role}</strong></span>
        {/* Cart */}
        <Link to="/cart" className="relative group flex items-center" aria-label="View cart" tabIndex={0}>
          <ShoppingCart size={26} className="mr-1 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 left-4 sm:left-6 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-pulse"
              style={{ minWidth: 18 }}
            >
              {cartCount}
            </span>
          )}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/admin/login"
            className={location.pathname === "/admin/login" ? "font-bold text-green-600" : ""}
          >
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
