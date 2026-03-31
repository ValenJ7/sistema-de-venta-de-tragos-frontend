import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { CategoriaGrid } from "../components/CategoriaGrid";
import { CategoriaModal } from "../components/CategoriaModal";
import type { Categoria } from "../types/categoria.types";
import { useCategorias } from "../hooks/useCategorias";

export function CategoriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const { data: categorias } = useCategorias();

  const openCreate = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const openEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Categorías
        </h1>
        <p className="text-slate-500 mt-1.5 font-medium">
          Administrá las categorías de productos de tu carta.
        </p>
      </div>

      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-black text-slate-800">
              Categorías registradas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {categorias?.length ?? 0} en total
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-orange-200 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Nueva categoría
          </button>
        </div>

        {/* Grid / list */}
        <div className="px-4 py-2">
          <CategoriaGrid onEdit={openEdit} />
        </div>
      </div>

      {/* Modal */}
      <CategoriaModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editingCategoria={editingCategoria}
      />
    </div>
  );
}
