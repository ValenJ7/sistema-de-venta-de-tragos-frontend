import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usuarioSchema,
  usuarioUpdateSchema,
  adminUsuarioSchema,
  adminUsuarioUpdateSchema,
  type UsuarioFormData,
  type Usuario,
} from "../types/usuario.types";
import { useCreateUsuario, useUpdateUsuario, useRoles, useNegocios } from "../hooks/useUsuarios";
import { useAppStore } from "../../../app/stores/useAppStore";

type Props = {
  editingUsuario?: Usuario | null;
  onClose: () => void;
};

export function UsuarioForm({ editingUsuario, onClose }: Props) {
  const isEditing = !!editingUsuario;
  const user = useAppStore((s) => s.user);
  const isSuperAdmin = user?.rol_nombre === 'superadmin';

  const schema = isEditing
    ? (isSuperAdmin ? usuarioUpdateSchema : adminUsuarioUpdateSchema)
    : (isSuperAdmin ? usuarioSchema : adminUsuarioSchema);

  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { data: negocios, isLoading: loadingNegocios } = useNegocios(isSuperAdmin);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(schema) as any,
  });

  const create = useCreateUsuario(onClose);
  const update = useUpdateUsuario(onClose);

  useEffect(() => {
    if (editingUsuario) {
      reset({
        nombre: editingUsuario.nombre,
        email: editingUsuario.email,
        password_hash: "",
        rol_id: editingUsuario.rol_id,
        ...(isSuperAdmin && { negocio_id: editingUsuario.negocio_id }),
      });
    } else {
      reset({ nombre: "", email: "", password_hash: "", rol_id: 0, ...(isSuperAdmin && { negocio_id: 0 }) });
    }
  }, [editingUsuario, reset]);

  const onSubmit = (data: UsuarioFormData) => {
    if (isEditing && editingUsuario) {
      const payload: any = { ...data };
      if (!payload.password_hash || payload.password_hash.trim() === "") {
        delete payload.password_hash;
      }
      update.mutate({ id: editingUsuario.id, data: payload });
    } else {
      create.mutate(data);
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nombre completo
        </label>
        <input
          {...register("nombre")}
          placeholder="Ej: Juan Perez"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="juan@cocktail.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {isEditing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}
        </label>
        <input
          type="password"
          {...register("password_hash")}
          placeholder={isEditing ? "Sin cambios" : "Mínimo 4 caracteres"}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800"
        />
        {errors.password_hash && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password_hash.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Rol
          </label>
          <select
            {...register("rol_id")}
            disabled={loadingRoles}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 appearance-none disabled:opacity-50 font-medium"
          >
            <option value="0" disabled>
              {loadingRoles ? "Cargando..." : "Seleccionar rol..."}
            </option>
            {roles?.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {errors.rol_id && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.rol_id.message}</p>
          )}
        </div>

        {isSuperAdmin && (
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Negocio
            </label>
            <select
              {...register("negocio_id")}
              disabled={loadingNegocios}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 appearance-none disabled:opacity-50 font-medium"
            >
              <option value="0" disabled>
                {loadingNegocios ? "Cargando..." : "Seleccionar negocio..."}
              </option>
              {negocios?.map((neg) => (
                <option key={neg.id} value={neg.id}>
                  {neg.nombre}
                </option>
              ))}
            </select>
            {errors.negocio_id && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.negocio_id.message}</p>
            )}
          </div>
        )}
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
          {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}
