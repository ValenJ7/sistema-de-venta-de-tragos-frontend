import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ProductoGrid } from "../components/ProductoGrid";
import { ProductoModal } from "../components/ProductoModal";
import type { Producto } from "../types/producto.types";
import { useProductos } from "../hooks/useProductos";

export function ProductosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const { data: productos } = useProductos();

  const openCreate = () => {
    setEditingProducto(null);
    setIsModalOpen(true);
  };

  const openEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProducto(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-orange-600 tracking-tight">
          Catálogo V2
        </h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">
          Administración completa de los productos y sus precios.
        </p>
      </div>

      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-black text-slate-800 text-xl">
              Productos Disponibles
            </h2>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              {productos?.length ?? 0} en total
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition shadow-sm shadow-orange-200"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {/* Grid / list */}
        <div className="px-4 py-2">
          <ProductoGrid onEdit={openEdit} />
        </div>
      </div>

      {/* Modal */}
      <ProductoModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editingProducto={editingProducto}
      />
    </div>
  );
}
