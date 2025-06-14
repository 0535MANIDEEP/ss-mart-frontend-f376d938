
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import AdminDashboard from "@/pages/AdminDashboard";
import AddOrEditProduct from "@/pages/AddOrEditProduct";
import Login from "@/auth/Login";
import ProtectedRoute from "@/auth/ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/product/new" element={<AddOrEditProduct />} />
            <Route path="/admin/product/edit/:id" element={<AddOrEditProduct />} />
          </Route>
          <Route path="*" element={<div className="py-32 text-center text-xl">404 Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
