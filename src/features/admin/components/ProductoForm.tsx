import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoFormData, type Producto } from "../types/producto.types";
import { useCreateProducto, useUpdateProducto } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";

type Props = {
  editingProducto?: Producto | null;
  onClose: () => void;
};

export function ProductoForm({ editingProducto, onClose }: Props) {
  const isEditing = !!editingProducto;

  const { data: categorias, isLoading: isLoadingCats } = useCategorias();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema) as any,
  });

  const create = useCreateProducto(onClose);
  const update = useUpdateProducto(onClose);

  useEffect(() => {
    if (editingProducto) {
      reset({
        nombre: editingProducto.nombre,
        precio: editingProducto.precio,
        categoria_id: editingProducto.categoria_id,
      });
    } else {
      reset({ nombre: "", precio: 0, categoria_id: 0 });
    }
  }, [editingProducto, reset]);

  const onSubmit = (data: ProductoFormData) => {
    if (isEditing && editingProducto) {
      update.mutate({ id: editingProducto.id, data });
    } else {
      create.mutate(data);
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nombre del producto
        </label>
        <input
          {...register("nombre")}
          placeholder="Ej: Fernet Branca 1L"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 placeholder-slate-400"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nombre.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        {/* Precio */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Precio ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="0.01"
              {...register("precio")}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 font-medium"
            />
          </div>
          {errors.precio && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.precio.message}</p>
          )}
        </div>

        {/* Categoría Select */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Categoría
          </label>
          <select
            {...register("categoria_id")}
            disabled={isLoadingCats}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 appearance-none disabled:opacity-50 font-medium"
          >
            <option value="0" disabled>
              {isLoadingCats ? "Cargando..." : "Seleccionar..."}
            </option>
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.categoria_id.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold transition shadow-sm shadow-orange-200"
        >
          {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
