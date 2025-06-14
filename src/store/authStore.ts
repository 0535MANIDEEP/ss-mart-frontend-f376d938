
import { create } from "zustand";

const AUTH_KEY = "ssmart_token";

const getToken = () => sessionStorage.getItem(AUTH_KEY);

export const useAuthStore = create((set) => ({
  token: getToken(),
  isAuthenticated: !!getToken(),
  login: (token: string) => {
    sessionStorage.setItem(AUTH_KEY, token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem(AUTH_KEY);
    set({ token: null, isAuthenticated: false });
  }
}));
