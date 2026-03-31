import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "sonner";
import { cerrarSesion } from "../api/sesion.service";

type Props = {
  sesionId: number;
  onCerrada: () => void;
};

export function CerrarSesionButton({ sesionId, onCerrada }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [montoFinal, setMontoFinal] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => cerrarSesion(sesionId, montoFinal || "0"),
    onSuccess: () => {
      toast.success("Sesión de caja cerrada correctamente");
      qc.invalidateQueries({ queryKey: ["sesion-activa"] });
      setIsOpen(false);
      onCerrada();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al cerrar la sesión";
      toast.error(msg);
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-xl font-bold transition text-sm uppercase"
      >
        Cerrar Caja
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
                <DialogTitle className="text-xl font-black text-slate-800 mb-4">
                  Cerrar Caja
                </DialogTitle>

                <p className="text-slate-500 text-sm mb-6">
                  Ingresa el monto final real en la caja para cerrar tu turno.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Monto final real ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={montoFinal}
                      onChange={(e) => setMontoFinal(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold transition"
                  >
                    {mutation.isPending ? "Cerrando..." : "Confirmar Cierre"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
