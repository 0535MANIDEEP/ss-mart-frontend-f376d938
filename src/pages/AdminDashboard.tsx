
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return navigate("/admin/login");
    api.get("/products")
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-extrabold">{t("dashboard")}</h2>
        <Link to="/admin/product/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition shadow">
          {t("addProduct")}
        </Link>
      </div>
      {loading
        ? <Loader />
        : (
          <table className="w-full border shadow bg-white rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2">{t("name")}</th>
                <th>{t("price")}</th>
                <th>{t("stock")}</th>
                <th>ID</th>
                <th className="w-32">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} className="border-b last:border-0">
                  <td className="py-1 px-2">{typeof prod.name === "object" ? prod.name.en : prod.name}</td>
                  <td>₹{prod.price}</td>
                  <td>{prod.stock}</td>
                  <td className="text-xs">{prod._id.slice(-6)}</td>
                  <td>
                    <Link className="text-blue-600 hover:underline mr-2" to={`/admin/product/edit/${prod._id}`}>{t("edit")}</Link>
                    <button className="text-red-500 hover:underline">{t("delete")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      {!loading && !products.length && (
        <p className="text-gray-500 text-center my-12">{t("noProducts")}</p>
      )}
    </div>
  );
};

export default AdminDashboard;
