import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriaSchema, type CategoriaFormData, type Categoria } from "../types/categoria.types";
import { useCreateCategoria, useUpdateCategoria } from "../hooks/useCategorias";

type Props = {
  editingCategoria?: Categoria | null;
  onClose: () => void;
};

export function CategoriaForm({ editingCategoria, onClose }: Props) {
  const isEditing = !!editingCategoria;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
  });

  const create = useCreateCategoria(onClose);
  const update = useUpdateCategoria(onClose);

  useEffect(() => {
    if (editingCategoria) {
      reset({ nombre: editingCategoria.nombre });
    } else {
      reset({ nombre: "" });
    }
  }, [editingCategoria, reset]);

  const onSubmit = (data: CategoriaFormData) => {
    if (isEditing && editingCategoria) {
      update.mutate({ id: editingCategoria.id, data });
    } else {
      create.mutate(data);
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nombre de la categoría
        </label>
        <input
          {...register("nombre")}
          placeholder="Ej: Cócteles, Cervezas, Vinos..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 placeholder-slate-400"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nombre.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
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
          {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Categoría"}
        </button>
      </div>
    </form>
  );
}
