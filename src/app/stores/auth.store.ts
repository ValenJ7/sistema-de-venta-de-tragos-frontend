import type { StateCreator } from "zustand";

export type AuthUser = {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  rol_nombre: string;
  negocio_id: number;
  negocio_nombre?: string;
};

export type AuthSlice = {
  user: AuthUser | null;
  token: string | null;
  setSession: (userData: AuthUser, token: string) => void;
  clearSession: () => void;
  logout: () => void;
  loadSession: () => void;
};

function loadFromStorage(): { user: AuthUser | null; token: string | null } {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) as AuthUser };
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return { user: null, token: null };
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ...loadFromStorage(),

  setSession: (userData: AuthUser, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, token });
  },

  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  loadSession: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ user, token });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
});
