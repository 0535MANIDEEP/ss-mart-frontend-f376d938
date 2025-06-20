
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import LoadingScreen from "@/components/LoadingScreen";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";
import RoleProtectedRoute from "@/auth/RoleProtectedRoute";
import React, { Suspense } from "react";
import RouterManager from "@/components/RouterManager";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/routes";
import PageWrapper from "@/layout/PageWrapper";

// Lazy loaded components
const LazyHome = React.lazy(() => import("@/pages/Home"));
const LazyProductDetails = React.lazy(() => import("@/pages/ProductDetails"));
const LazyCheckout = React.lazy(() => import("@/pages/Checkout"));
const LazyOrderSuccess = React.lazy(() => import("@/pages/OrderSuccess"));
const LazyAdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const LazyAddOrEditProduct = React.lazy(() => import("@/pages/AddOrEditProduct"));
const LazyLogin = React.lazy(() => import("@/auth/Login"));
const LazyAuth = React.lazy(() => import("@/pages/Auth"));
const LazyVisitList = React.lazy(() => import("@/pages/VisitList"));

const App = () => (
  <PageWrapper>
    <AuthProvider>
      <BrowserRouter>
        <RouterManager />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50 dark:from-lux-black dark:via-gray-950 dark:to-green-950">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.HOME} />} />
                <Route path={ROUTES.HOME} element={<LazyHome />} />
                <Route path={ROUTES.PRODUCT()} element={<LazyProductDetails />} />
                {/* Cart route now shows VisitList (lazy) */}
                <Route path={ROUTES.CART} element={<LazyVisitList />} />
                {/* Direct Visit List route for Navbar, also lazy */}
                <Route path="/visit-list" element={<LazyVisitList />} />
                <Route path={ROUTES.CHECKOUT} element={<LazyCheckout />} />
                <Route path={ROUTES.ORDER_SUCCESS} element={<LazyOrderSuccess />} />
                <Route path={ROUTES.LOGIN} element={<LazyAuth />} />
                {/* Legacy admin login page */}
                <Route path="/admin/login" element={<LazyLogin />} />

                {/* Admin protected routes */}
                <Route
                  path={ROUTES.ADMIN_DASHBOARD}
                  element={<RoleProtectedRoute allowedRoles={["admin"]}><LazyAdminDashboard /></RoleProtectedRoute>}
                />
                <Route
                  path={ROUTES.ADMIN_PRODUCT_NEW}
                  element={<RoleProtectedRoute allowedRoles={["admin"]}><LazyAddOrEditProduct /></RoleProtectedRoute>}
                />
                <Route
                  path={ROUTES.ADMIN_PRODUCT_EDIT()}
                  element={<RoleProtectedRoute allowedRoles={["admin"]}><LazyAddOrEditProduct /></RoleProtectedRoute>}
                />

                {/* Unauthorized fallback */}
                <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedScreen />} />
                {/* Loading fallback; can be used for suspense */}
                <Route path={ROUTES.LOADING} element={<LoadingScreen />} />

                {/* 404 using NotFound */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </PageWrapper>
);

export default App;
