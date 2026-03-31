import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useProductos, useDeleteProducto } from "../hooks/useProductos";
import type { Producto } from "../types/producto.types";
import { formatPrice } from "../../../shared/utils/format";

type Props = {
  onEdit: (producto: Producto) => void;
};

export function ProductoGrid({ onEdit }: Props) {
  const { data: productos, isLoading, isError } = useProductos();
  const deleteMutation = useDeleteProducto();
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
          <div key={i} className="h-[76px] bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Error al cargar los productos. Verificá la conexión con el servidor.
      </div>
    );
  }

  if (!productos?.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <ExclamationCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-semibold">No hay productos registrados aún.</p>
        <p className="text-sm mt-1">Creá el primero usando el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {productos.map((prod) => (
        <div
          key={prod.id}
          className="flex items-center gap-4 py-4 px-3 hover:bg-slate-50 transition rounded-xl group"
        >
          {/* Avatar placeholder for aesthetic */}
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 font-black text-lg shadow-sm">
            {prod.nombre.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate text-lg">{prod.nombre}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                {prod.categoria?.nombre || "Sin Categoría"}
              </span>
              <span className="text-xs text-slate-400">ID #{prod.id}</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right px-4">
            <p className="font-black text-orange-600 text-lg">{formatPrice(prod.precio)}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => { onEdit(prod); setConfirmId(null); }}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition"
              title="Editar"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleDelete(prod.id)}
              disabled={deleteMutation.isPending}
              className={`p-2 rounded-lg transition font-semibold text-xs ${
                confirmId === prod.id
                  ? "bg-red-500 text-white px-3 shadow-md"
                  : "text-red-400 hover:bg-red-50"
              }`}
              title="Eliminar"
            >
              {confirmId === prod.id ? "¡Borrar!" : <TrashIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
