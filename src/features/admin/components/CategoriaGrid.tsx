import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TagIcon } from "@heroicons/react/24/solid";
import { useCategorias, useDeleteCategoria } from "../hooks/useCategorias";
import type { Categoria } from "../types/categoria.types";

type Props = {
  onEdit: (categoria: Categoria) => void;
};

export function CategoriaGrid({ onEdit }: Props) {
  const { data: categorias, isLoading, isError } = useCategorias();
  const deleteMutation = useDeleteCategoria();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirmId === id) {
      deleteMutation.mutate(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Error al cargar las categorías. Verificá la conexión con el servidor.
      </div>
    );
  }

  if (!categorias?.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <TagIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-semibold">No hay categorías registradas aún.</p>
        <p className="text-sm mt-1">Creá la primera usando el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {categorias.map((cat) => (
        <div
          key={cat.id}
          className="flex items-center gap-4 py-4 px-2 hover:bg-orange-50/50 transition rounded-xl group"
        >
          {/* Icon badge */}
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <TagIcon className="w-5 h-5 text-orange-500" />
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate">{cat.nombre}</p>
            <p className="text-xs text-slate-400">ID #{cat.id}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => { onEdit(cat); setConfirmId(null); }}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition"
              title="Editar"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDelete(cat.id)}
              disabled={deleteMutation.isPending}
              className={`p-2 rounded-lg transition font-semibold text-xs ${
                confirmId === cat.id
                  ? "bg-red-500 text-white px-3"
                  : "text-red-400 hover:bg-red-50"
              }`}
              title="Eliminar"
            >
              {confirmId === cat.id ? "¿Confirmar?" : <TrashIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
