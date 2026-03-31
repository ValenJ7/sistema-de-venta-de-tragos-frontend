import { createBrowserRouter, ScrollRestoration, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { ProductosPage as AdminProductosPage } from "../features/admin/views/ProductosPage";
import { LoginPage } from "../features/auth/views/LoginPage";
import { PosPage } from "../features/pos/views/PosPage";
import { DashboardPage as AdminDashboardPage } from "../features/admin/views/DashboardPage";
import { ShiftsPage as AdminCashierShiftPage } from "../features/admin/views/ShiftsPage";
import { CategoriasPage as AdminCategoriasPage } from "../features/admin/views/CategoriasPage";
import { UsuariosPage as AdminUsuariosPage } from "../features/admin/views/UsuariosPage";
import { HistorialPage as AdminHistorialPage } from "../features/admin/views/HistorialPage";
import { NegociosPage as AdminNegociosPage } from "../features/admin/views/NegociosPage";
import { CajasPage as AdminCajasPage } from "../features/admin/views/CajasPage";
import { PerfilPage } from "../features/auth/views/PerfilPage";
import { ForgotPasswordPage } from "../features/auth/views/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/views/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      // Login público
      { index: true, element: <LoginPage /> },

      // Rutas de Administración (solo admin)
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProductosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/caja/:cashierUserId",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCashierShiftPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/categorias",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCategoriasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/usuarios",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsuariosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/cajas",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCajasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/historial",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHistorialPage />
          </ProtectedRoute>
        ),
      },

      // Negocios (solo superadmin)
      {
        path: "admin/negocios",
        element: (
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <AdminNegociosPage />
          </ProtectedRoute>
        ),
      },

      // POS (cajero y admin)
      {
        path: "pos",
        element: (
          <ProtectedRoute allowedRoles={["cajero", "admin"]}>
            <PosPage />
          </ProtectedRoute>
        ),
      },

      // Perfil (cualquier usuario autenticado)
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        ),
      },

      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },

      // Redirección
      { path: "login", element: <Navigate to="/" replace /> },
    ],
  },
]);
