import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../../app/stores/useAppStore";

export function Header() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = useAppStore((s: any) => s.user);
  const logout = useAppStore((s: any) => s.logout);

  const handleLogout = () => {
    logout();
    qc.clear(); // Limpiar todo el cache de React Query
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase font-bold transition ${isActive ? "text-orange-400" : "text-white hover:text-orange-200"}`;

  const isAdmin = user?.rol_nombre === "admin";
  const isSuperAdmin = user?.rol_nombre === "superadmin";

  return (
    <header className="bg-slate-800 shadow-md">
      <div className="mx-auto container px-5 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="logo" className="w-12" />
            <span className="text-white font-black text-xl tracking-tighter">
              {isSuperAdmin ? "COCKTAIL SUPER" : isAdmin ? "COCKTAIL ADMIN" : "COCKTAIL POS"}
            </span>
          </div>

          <nav className="flex gap-6 items-center">
            {user && isSuperAdmin && (
              <NavLink to="/admin/negocios" className={linkClass}>Negocios</NavLink>
            )}

            {user && isAdmin && (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/admin" className={linkClass} end>Productos</NavLink>
                <NavLink to="/admin/categorias" className={linkClass}>Categorías</NavLink>
                <NavLink to="/admin/cajas" className={linkClass}>Cajas</NavLink>
                <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>
                <NavLink to="/admin/historial" className={linkClass}>Historial</NavLink>
              </>
            )}

            {user && !isAdmin && !isSuperAdmin && (
              <>
                <NavLink to="/pos" className={linkClass}>Punto de Venta</NavLink>
                <span className="text-white font-bold text-sm">
                  {user.nombre}
                </span>
              </>
            )}

            {user && (
              <>
                <NavLink to="/perfil" className={linkClass}>Perfil</NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition text-xs uppercase"
                >
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
