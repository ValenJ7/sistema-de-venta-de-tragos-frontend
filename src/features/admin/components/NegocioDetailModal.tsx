import { XMarkIcon, UserIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import type { Negocio } from "../types/negocio.types";

type Props = {
  negocio: Negocio;
  onClose: () => void;
};

const ROL_BADGE: Record<string, string> = {
  admin: "bg-orange-100 text-orange-700",
  cajero: "bg-blue-100 text-blue-700",
  superadmin: "bg-purple-100 text-purple-700",
};

export function NegocioDetailModal({ negocio, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${negocio.activo ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-400"}`}>
              <BuildingStorefrontIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-xl">{negocio.nombre}</h2>
              <p className="text-sm text-slate-400">
                {negocio.config_moneda} &middot;{" "}
                <span className={`font-semibold ${negocio.activo ? "text-green-600" : "text-red-500"}`}>
                  {negocio.activo ? "Activo" : "Suspendido"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <UserIcon className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
              Usuarios ({negocio.usuarios?.length ?? 0})
            </h3>
          </div>
          {!negocio.usuarios || negocio.usuarios.length === 0 ? (
            <p className="text-sm text-slate-400">Sin usuarios registrados</p>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Rol</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {negocio.usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.nombre}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.Rol ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${ROL_BADGE[u.Rol.nombre] ?? "bg-slate-100 text-slate-600"}`}>
                            {u.Rol.nombre}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
