import { useState, useMemo } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useProductos } from "../../admin/hooks/useProductos";
import type { Producto } from "../../admin/types/producto.types";
import { formatPrice } from "../../../shared/utils/format";

type Props = {
  onSelect: (producto: Producto) => void;
};

export function PosProductPicker({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: productos, isLoading } = useProductos();

  const filteredProductos = useMemo(() => {
    if (!productos) return [];
    if (!search.trim()) return productos;
    const lowerSearch = search.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(lowerSearch) ||
        p.categoria?.nombre.toLowerCase().includes(lowerSearch)
    );
  }, [productos, search]);

  const handleSelect = (producto: Producto) => {
    onSelect(producto);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow"
        >
          <PlusIcon className="w-7 h-7" />
        </button>

        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 rounded-xl border border-orange-200 px-4 outline-none bg-orange-50/40 font-medium"
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-3 w-full max-h-80 overflow-y-auto rounded-2xl border border-orange-200 bg-white shadow-lg custom-scrollbar">
          <ul className="divide-y divide-orange-100">
            {isLoading ? (
              <li className="p-4 text-center text-slate-500 text-sm font-medium">
                Cargando productos...
              </li>
            ) : filteredProductos.length === 0 ? (
              <li className="p-4 text-center text-slate-500 text-sm font-medium">
                No se encontraron productos.
              </li>
            ) : (
              filteredProductos.map((prod) => (
                <li key={prod.id}>
                  <button
                    type="button"
                    className="w-full text-left p-4 hover:bg-orange-50 flex items-center justify-between gap-4 transition"
                    onClick={() => handleSelect(prod)}
                  >
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 truncate text-lg">{prod.nombre}</p>
                      <p className="text-xs text-orange-600 font-bold mt-0.5 uppercase tracking-wide">
                        {prod.categoria?.nombre || "Sin Categoría"}
                      </p>
                    </div>
                    <span className="font-black text-orange-500 text-lg">
                      {formatPrice(prod.precio)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="p-3 border-t border-orange-100 bg-orange-50/50 sticky bottom-0 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-bold text-orange-700 bg-white border border-orange-200 rounded-lg hover:bg-orange-100 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}