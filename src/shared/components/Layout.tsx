import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./Header";
import DrinkDetailsModal from "./DrinkDetailsModal";
import Notification from "./Notification";
import { useAppStore } from "../../app/stores/useAppStore";
import api from "../api/client";

export function Layout() {
  useLocation();
  const token = useAppStore((s: any) => s.token);
  const setSession = useAppStore((s: any) => s.setSession);
  const clearSession = useAppStore((s: any) => s.clearSession);

  useEffect(() => {
    // Validar token con el backend (refresca datos del usuario)
    if (token) {
      api.get("/auth/me")
        .then(({ data }) => setSession(data.data, token))
        .catch(() => clearSession());
    }
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 text-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-10">
        <Outlet />
      </main>
      <DrinkDetailsModal />
      <Notification />
      <Toaster richColors position="top-right" />
    </div>
  );
}
