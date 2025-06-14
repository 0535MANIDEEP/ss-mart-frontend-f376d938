
/**
 * Centralized route constants for navigation.
 */
export const ROUTES = {
  HOME: "/home",
  ROOT: "/",
  PRODUCT: (id = ":id") => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",
  LOGIN: "/auth",
  SIGNUP: "/auth?mode=signup",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCT_NEW: "/admin/product/new",
  ADMIN_PRODUCT_EDIT: (id = ":id") => `/admin/product/edit/${id}`,
  UNAUTHORIZED: "/unauthorized",
  LOADING: "/loading",
  NOT_FOUND: "/not-found",
};
