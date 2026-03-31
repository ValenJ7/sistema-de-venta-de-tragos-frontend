import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { getNegocios, createNegocio, deleteNegocio, suspenderNegocio, activarNegocio } from "../api/negocio.service";
import type { NegocioFormData } from "../types/negocio.types";

export function NegociosPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NegocioFormData>({
    nombre: "",
    config_moneda: "ARS",
    admin_nombre: "",
    admin_email: "",
    admin_password: "",
  });

  const { data: negocios, isLoading, isError } = useQuery({
    queryKey: ["negocios"],
    queryFn: getNegocios,
  });

  const createMut = useMutation({
    mutationFn: createNegocio,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["negocios"] });
      toast.success(`Negocio "${data.negocio.nombre}" creado con admin ${data.admin.email}`);
      setShowForm(false);
      setForm({ nombre: "", config_moneda: "ARS", admin_nombre: "", admin_email: "", admin_password: "" });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al crear negocio"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteNegocio,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["negocios"] });
      toast.success("Negocio eliminado");
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al eliminar negocio"),
  });

  const suspenderMut = useMutation({
    mutationFn: suspenderNegocio,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["negocios"] });
      toast.warning(`Negocio "${data.nombre}" suspendido`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al suspender negocio"),
  });

  const activarMut = useMutation({
    mutationFn: activarNegocio,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["negocios"] });
      toast.success(`Negocio "${data.nombre}" activado`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al activar negocio"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.admin_nombre || !form.admin_email || !form.admin_password) {
      toast.error("Completa todos los campos");
      return;
    }
    createMut.mutate(form);
  };

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`Eliminar negocio "${nombre}"? Esta acción no se puede deshacer.`)) {
      deleteMut.mutate(id);
    }
  };

  const handleToggleActivo = (id: number, nombre: string, activo: boolean) => {
    if (activo) {
      if (confirm(`¿Suspender negocio "${nombre}" por falta de pago? Sus usuarios no podrán ingresar al sistema.`)) {
        suspenderMut.mutate(id);
      }
    } else {
      activarMut.mutate(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-orange-600 tracking-tight">Negocios</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">
          Gestión de negocios registrados en el sistema.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-black text-slate-800 text-xl">Negocios Registrados</h2>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              {negocios?.length ?? 0} en total &middot;{" "}
              <span className="text-red-400">
                {negocios?.filter((n) => !n.activo).length ?? 0} suspendidos
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition shadow-sm shadow-orange-200"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Negocio
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b border-slate-100 bg-orange-50/30">
            <h3 className="font-bold text-slate-700 mb-4">Crear Negocio + Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nombre del negocio"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <select
                className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                value={form.config_moneda}
                onChange={(e) => setForm({ ...form, config_moneda: e.target.value })}
              >
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
              <input
                className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nombre del admin"
                value={form.admin_nombre}
                onChange={(e) => setForm({ ...form, admin_nombre: e.target.value })}
              />
              <input
                type="email"
                className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Email del admin"
                value={form.admin_email}
                onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
              />
              <input
                type="password"
                className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Contraseña del admin"
                value={form.admin_password}
                onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={createMut.isPending}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition"
              >
                {createMut.isPending ? "Creando..." : "Crear Negocio"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {isLoading && <div className="p-10 text-center text-slate-400">Cargando...</div>}
        {isError && <div className="p-10 text-center text-red-400">Error al cargar los negocios</div>}

        {!isLoading && !isError && (
          <div className="divide-y divide-slate-100">
            {negocios?.length === 0 && (
              <div className="p-10 text-center text-slate-400">No hay negocios registrados</div>
            )}
            {negocios?.map((neg) => (
              <div
                key={neg.id}
                className={`px-6 py-5 flex items-center justify-between transition ${
                  neg.activo ? "hover:bg-slate-50" : "bg-red-50/40 hover:bg-red-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${neg.activo ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-400"}`}>
                    <BuildingOfficeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-lg">{neg.nombre}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        neg.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {neg.activo ? "Activo" : "Suspendido"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Moneda: {neg.config_moneda} &middot;{" "}
                      {neg.usuarios?.length ?? 0} usuarios &middot;{" "}
                      {neg.cajas?.length ?? 0} cajas
                    </p>
                    {neg.usuarios && neg.usuarios.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Admin: {neg.usuarios.find((u) => u.activo)?.email || neg.usuarios[0].email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleActivo(neg.id, neg.nombre, neg.activo)}
                    disabled={suspenderMut.isPending || activarMut.isPending}
                    title={neg.activo ? "Click para suspender" : "Click para activar"}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="text-xs font-bold text-slate-400">
                      {neg.activo ? "Activo" : "Suspendido"}
                    </span>
                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${neg.activo ? "bg-green-500" : "bg-slate-300"}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${neg.activo ? "left-5" : "left-0.5"}`} />
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(neg.id, neg.nombre)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Eliminar negocio"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
