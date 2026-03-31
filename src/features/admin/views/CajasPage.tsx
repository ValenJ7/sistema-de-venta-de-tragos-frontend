import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { getCajas, createCaja, updateCaja, deleteCaja } from "../api/caja.service";

export function CajasPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: cajas, isLoading } = useQuery({
    queryKey: ["cajas-admin"],
    queryFn: getCajas,
  });

  const createMut = useMutation({
    mutationFn: (nombre: string) => createCaja(nombre),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cajas-admin"] });
      toast.success("Caja creada");
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al crear caja"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, nombre }: { id: number; nombre: string }) => updateCaja(id, nombre),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cajas-admin"] });
      toast.success("Caja actualizada");
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al actualizar caja"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCaja,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cajas-admin"] });
      toast.success("Caja eliminada");
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Error al eliminar caja"),
  });

  const resetForm = () => {
    setShowForm(false);
    setNombre("");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (editingId) {
      updateMut.mutate({ id: editingId, nombre });
    } else {
      createMut.mutate(nombre);
    }
  };

  const handleEdit = (caja: { id: number; nombre: string }) => {
    setEditingId(caja.id);
    setNombre(caja.nombre);
    setShowForm(true);
  };

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`Eliminar caja "${nombre}"?`)) {
      deleteMut.mutate(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-orange-600 tracking-tight">
          Cajas
        </h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">
          Gestión de cajas registradoras.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-black text-slate-800 text-xl">Cajas Registradas</h2>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              {cajas?.length ?? 0} en total
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition shadow-sm shadow-orange-200"
          >
            <PlusIcon className="w-5 h-5" />
            Nueva Caja
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b border-slate-100 bg-orange-50/30 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-600 mb-1">
                {editingId ? "Editar nombre" : "Nombre de la caja"}
              </label>
              <input
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Ej: Barra VIP"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={createMut.isPending || updateMut.isPending}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              {editingId ? "Guardar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition"
            >
              Cancelar
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="p-10 text-center text-slate-400">Cargando...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cajas?.map((caja) => (
              <div key={caja.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <h3 className="font-bold text-slate-800">{caja.nombre}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    caja.estado === "ABIERTA"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {caja.estado}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(caja)}
                    className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-lg transition"
                    title="Editar"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(caja.id, caja.nombre)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {cajas?.length === 0 && (
              <div className="p-10 text-center text-slate-400">No hay cajas registradas</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
