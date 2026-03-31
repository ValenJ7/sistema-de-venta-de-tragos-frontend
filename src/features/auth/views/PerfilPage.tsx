import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCircleIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useAppStore } from "../../../app/stores/useAppStore";
import api from "../../../shared/api/client";

export function PerfilPage() {
  const user = useAppStore((s: any) => s.user);
  const setSession = useAppStore((s: any) => s.setSession);
  const token = useAppStore((s: any) => s.token);

  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const mut = useMutation({
    mutationFn: async (payload: object) => {
      const { data } = await api.patch("/auth/perfil", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Perfil actualizado");
      // Actualizar nombre en el store si cambió
      if (nombre !== user?.nombre) {
        setSession({ ...user, nombre }, token);
      }
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirm("");
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al actualizar perfil"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordNueva && passwordNueva !== passwordConfirm) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    const payload: any = {};
    if (nombre.trim() && nombre !== user?.nombre) payload.nombre = nombre.trim();
    if (passwordNueva) {
      payload.password_actual = passwordActual;
      payload.password_nueva = passwordNueva;
    }

    if (Object.keys(payload).length === 0) {
      toast.error("No hay cambios para guardar");
      return;
    }

    mut.mutate(payload);
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">Mi Perfil</h1>
        <p className="text-slate-500 mt-1 font-medium">Editá tu nombre y contraseña</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="bg-orange-100 text-orange-500 p-3 rounded-xl">
            <UserCircleIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-lg">{user?.nombre}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="text-xs font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {user?.rol_nombre}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
            <input
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <KeyIcon className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Cambiar contraseña</span>
              <span className="text-xs text-slate-400">(opcional)</span>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Contraseña actual"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nueva contraseña"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Confirmar nueva contraseña"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
          >
            {mut.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
