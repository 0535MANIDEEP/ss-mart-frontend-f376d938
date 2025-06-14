
import { create } from "zustand";

const AUTH_KEY = "ssmart_token";

const getToken = () => sessionStorage.getItem(AUTH_KEY);

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
