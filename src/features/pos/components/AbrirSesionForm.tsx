import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCajasDisponibles, abrirSesion } from "../api/sesion.service";
import type { SesionCaja } from "../api/sesion.service";

type Props = {
  usuarioId: number;
  onSesionAbierta: (sesion: SesionCaja) => void;
};

export function AbrirSesionForm({ usuarioId, onSesionAbierta }: Props) {
  const [cajaId, setCajaId] = useState<number>(0);
  const [montoInicial, setMontoInicial] = useState("");
  const qc = useQueryClient();

  const { data: cajas, isLoading } = useQuery({
    queryKey: ["cajas-disponibles"],
    queryFn: getCajasDisponibles,
  });

  const mutation = useMutation({
    mutationFn: () =>
      abrirSesion({
        usuario_id: usuarioId,
        caja_id: cajaId,
        monto_inicial: montoInicial || "0",
      }),
    onSuccess: (sesion) => {
      toast.success("Sesión de caja abierta");
      qc.invalidateQueries({ queryKey: ["sesion-activa"] });
      onSesionAbierta(sesion);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al abrir la sesión";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cajaId) {
      toast.error("Selecciona una caja");
      return;
    }
    mutation.mutate();
  };

  return (
    <section className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Abrir Caja</h2>
          <p className="text-slate-400 text-sm mt-1">
            Selecciona una caja disponible para iniciar tu turno
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Caja
            </label>
            <select
              value={cajaId}
              onChange={(e) => setCajaId(Number(e.target.value))}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 appearance-none font-medium"
            >
              <option value={0} disabled>
                {isLoading ? "Cargando cajas..." : "Seleccionar caja..."}
              </option>
              {cajas?.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.nombre}
                </option>
              ))}
            </select>
            {!isLoading && cajas?.length === 0 && (
              <p className="text-amber-500 text-xs mt-1.5 font-medium">
                No hay cajas disponibles. Todas están en uso.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Monto inicial ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !cajaId}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 py-4 rounded-xl text-white font-black uppercase shadow-lg shadow-orange-200 transition-all"
          >
            {mutation.isPending ? "Abriendo..." : "Abrir Caja"}
          </button>
        </form>
      </div>
    </section>
  );
}
