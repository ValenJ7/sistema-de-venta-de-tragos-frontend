import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAppStore } from "../../app/stores/useAppStore";

export function Header() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = useAppStore((s: any) => s.user);
  const logout = useAppStore((s: any) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    qc.clear();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase font-bold transition text-sm ${isActive ? "text-orange-400" : "text-white hover:text-orange-200"}`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase font-bold transition py-2 px-3 rounded-lg text-sm ${isActive ? "text-orange-400 bg-slate-700" : "text-white hover:text-orange-200 hover:bg-slate-700"}`;

  const isAdmin = user?.rol_nombre === "admin";
  const isSuperAdmin = user?.rol_nombre === "superadmin";

  const closeMenu = () => setMobileOpen(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {user && isSuperAdmin && (
        <NavLink to="/admin/negocios" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Negocios</NavLink>
      )}
      {user && isAdmin && (
        <>
          <NavLink to="/admin/dashboard" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Dashboard</NavLink>
          <NavLink to="/admin" className={onClick ? mobileLinkClass : linkClass} end onClick={onClick}>Productos</NavLink>
          <NavLink to="/admin/categorias" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Categorías</NavLink>
          <NavLink to="/admin/cajas" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Cajas</NavLink>
          <NavLink to="/admin/usuarios" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Usuarios</NavLink>
          <NavLink to="/admin/historial" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Historial</NavLink>
        </>
      )}
      {user && !isAdmin && !isSuperAdmin && (
        <>
          <NavLink to="/pos" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Punto de Venta</NavLink>
          <span className="text-white font-bold text-sm px-3">{user.nombre}</span>
        </>
      )}
      {user && (
        <>
          <NavLink to="/perfil" className={onClick ? mobileLinkClass : linkClass} onClick={onClick}>Perfil</NavLink>
          <button
            onClick={() => { handleLogout(); onClick?.(); }}
            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition text-xs uppercase w-full md:w-auto text-left md:text-center"
          >
            Salir
          </button>
        </>
      )}
    </>
  );

  return (
    <header className="bg-slate-800 shadow-md">
      <div className="mx-auto container px-4 sm:px-5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="w-10" />
            <span className="text-white font-black text-base sm:text-xl tracking-tighter">
              {isSuperAdmin ? "COCKTAIL SUPER" : isAdmin ? "COCKTAIL ADMIN" : "COCKTAIL POS"}
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
            <NavLinks />
          </nav>

          {/* Mobile hamburger */}
          {user && (
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-slate-700 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden flex flex-col gap-1 pt-4 pb-2 border-t border-slate-700 mt-4">
            <NavLinks onClick={closeMenu} />
          </nav>
        )}
      </div>
    </header>
  );
}
