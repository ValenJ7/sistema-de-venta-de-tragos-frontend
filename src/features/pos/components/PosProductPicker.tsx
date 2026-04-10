import { useState, useMemo, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useProductos } from "../../admin/hooks/useProductos";
import { useCategorias } from "../../admin/hooks/useCategorias";
import type { Producto } from "../../admin/types/producto.types";
import { formatPrice } from "../../../shared/utils/format";

type Props = {
  onSelect: (producto: Producto) => void;
};

export function PosProductPicker({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: productos, isLoading } = useProductos();
  const { data: categorias } = useCategorias();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const productCountByCategory = useMemo(() => {
    if (!productos) return {} as Record<number, number>;
    const counts: Record<number, number> = {};
    for (const p of productos) {
      if (p.categoria_id) {
        counts[p.categoria_id] = (counts[p.categoria_id] ?? 0) + 1;
      }
    }
    return counts;
  }, [productos]);

  const filteredProductos = useMemo(() => {
    if (!productos) return [];
    let result = productos;

    if (selectedCategoryId !== null) {
      result = result.filter((p) => p.categoria_id === selectedCategoryId);
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(lower) ||
          p.categoria?.nombre.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [productos, selectedCategoryId, search]);

  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setIsOpen(true);
    setSearch("");
  };

  const handleSelect = (producto: Producto) => {
    onSelect(producto);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCategoryId(null);
    setIsOpen(false);
  };

  const selectedCategoryName = categorias?.find((c) => c.id === selectedCategoryId)?.nombre;

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2">
        <CategoryPill
          label="Todos"
          count={productos?.length ?? 0}
          active={selectedCategoryId === null}
          onClick={() => handleSelectCategory(null)}
          tooltip={`Ver todos los productos (${productos?.length ?? 0})`}
        />
        {categorias?.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.nombre}
            count={productCountByCategory[cat.id] ?? 0}
            active={selectedCategoryId === cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            tooltip={`${cat.nombre}: ${productCountByCategory[cat.id] ?? 0} producto${(productCountByCategory[cat.id] ?? 0) !== 1 ? "s" : ""}`}
          />
        ))}
      </div>

      {/* Buscador */}
      <div className="relative">
        <div className="flex items-center gap-2 h-12 rounded-xl border border-orange-200 bg-orange-50/40 px-4 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition">
          <MagnifyingGlassIcon className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            placeholder={
              selectedCategoryName
                ? `Buscar en ${selectedCategoryName}...`
                : "Buscar productos..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 bg-transparent outline-none font-medium text-slate-700 placeholder:text-slate-400"
          />
          {(search || selectedCategoryId !== null) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown de productos */}
        {isOpen && (
          <div className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl border border-orange-200 bg-white shadow-lg custom-scrollbar">
            {selectedCategoryName && (
              <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                  {selectedCategoryName}
                </span>
                <span className="text-xs text-slate-400">
                  ({filteredProductos.length} producto{filteredProductos.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

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
                        <p className="font-extrabold text-slate-800 truncate text-lg">
                          {prod.nombre}
                        </p>
                        <p className="text-xs text-orange-600 font-bold mt-0.5 uppercase tracking-wide">
                          {prod.categoria?.nombre || "Sin Categoría"}
                        </p>
                      </div>
                      <span className="font-black text-orange-500 text-lg shrink-0">
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
    </div>
  );
}

// ──────────────────────────────────────────────
// Sub-componente: pill de categoría con tooltip
// ──────────────────────────────────────────────
type CategoryPillProps = {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tooltip: string;
};

function CategoryPill({ label, active, onClick, tooltip }: CategoryPillProps) {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`
          px-3 py-1.5 rounded-full text-sm font-bold transition select-none
          ${active
            ? "bg-orange-500 text-white shadow-sm"
            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }
        `}
      >
        {label}
      </button>

      {/* Tooltip */}
      <div className="
        pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30
        after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
        after:border-4 after:border-transparent after:border-t-slate-800
      ">
        {tooltip}
      </div>
    </div>
  );
}
