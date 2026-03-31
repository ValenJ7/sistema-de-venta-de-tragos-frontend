import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { UsuarioGrid } from "../components/UsuarioGrid";
import { UsuarioModal } from "../components/UsuarioModal";
import type { Usuario } from "../types/usuario.types";
import { useUsuarios } from "../hooks/useUsuarios";

export function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const { data: usuarios } = useUsuarios();

  const openCreate = () => {
    setEditingUsuario(null);
    setIsModalOpen(true);
  };

  const openEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-orange-600 tracking-tight">
          Usuarios
        </h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">
          Gestión de usuarios y asignación de roles.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-black text-slate-800 text-xl">
              Usuarios Registrados
            </h2>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              {usuarios?.length ?? 0} en total
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition shadow-sm shadow-orange-200"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>

        <div className="px-4 py-2">
          <UsuarioGrid onEdit={openEdit} />
        </div>
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editingUsuario={editingUsuario}
      />
    </div>
  );
}
