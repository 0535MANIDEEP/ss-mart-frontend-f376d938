
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

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
    <nav className="flex justify-between items-center bg-white shadow w-full px-8 py-3 z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold text-green-600 tracking-wide">
          SS MART
        </Link>
      </div>

      <div className="flex items-center gap-6 text-lg">
        <span className="text-sm italic">Logged in as: <strong>{role}</strong></span>

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
