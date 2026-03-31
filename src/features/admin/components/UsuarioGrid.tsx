import { useState } from "react";
import { PencilSquareIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useUsuarios, useDeactivateUsuario } from "../hooks/useUsuarios";
import type { Usuario } from "../types/usuario.types";

type Props = {
  onEdit: (usuario: Usuario) => void;
};

export function UsuarioGrid({ onEdit }: Props) {
  const { data: usuarios, isLoading, isError } = useUsuarios();
  const deactivateMutation = useDeactivateUsuario();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDeactivate = (id: number) => {
    if (confirmId === id) {
      deactivateMutation.mutate(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[76px] bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Error al cargar los usuarios. Verifica la conexión con el servidor.
      </div>
    );
  }

  if (!usuarios?.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <ExclamationCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-semibold">No hay usuarios registrados aún.</p>
        <p className="text-sm mt-1">Crea el primero usando el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {usuarios.map((user) => (
        <div
          key={user.id}
          className={`flex items-center gap-4 py-4 px-3 hover:bg-slate-50 transition rounded-xl group ${
            !user.activo ? "opacity-50" : ""
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-lg shadow-sm ${
              user.rol?.nombre === "admin"
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {user.nombre.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate text-lg">{user.nombre}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">{user.email}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  user.rol?.nombre === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.rol?.nombre || "Sin Rol"}
              </span>
              {!user.activo && (
                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                  Inactivo
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => { onEdit(user); setConfirmId(null); }}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition"
              title="Editar"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>

            {user.activo && (
              <button
                onClick={() => handleDeactivate(user.id)}
                disabled={deactivateMutation.isPending}
                className={`p-2 rounded-lg transition font-semibold text-xs ${
                  confirmId === user.id
                    ? "bg-red-500 text-white px-3 shadow-md"
                    : "text-red-400 hover:bg-red-50"
                }`}
                title="Desactivar"
              >
                {confirmId === user.id ? "Desactivar" : <NoSymbolIcon className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
