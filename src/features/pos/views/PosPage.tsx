import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PosProductPicker } from "../components/PosProductPicker";
import { PosCart } from "../components/PosCart";
import { PosNightSales } from "../components/PosNightSales";
import { AbrirSesionForm } from "../components/AbrirSesionForm";
import { CerrarSesionButton } from "../components/CerrarSesionButton";
import { useCheckout, printTicket } from "../hooks/useVentas";
import { getSesionActiva } from "../api/sesion.service";
import type { SesionCaja } from "../api/sesion.service";
import type { Producto } from "../../admin/types/producto.types";
import { useAppStore } from "../../../app/stores/useAppStore";
import { toast } from "sonner";

export type CartItem = {
  producto: Producto;
  quantity: number;
};

export function PosPage() {
  const user = useAppStore((s: any) => s.user);
  const qc = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sesionLocal, setSesionLocal] = useState<SesionCaja | null>(null);

  const { data: sesionActiva, isLoading: loadingSesion } = useQuery({
    queryKey: ["sesion-activa", user?.id],
    queryFn: () => getSesionActiva(user?.id),
    enabled: !!user?.id,
  });

  const sesion = sesionLocal || sesionActiva;

  const checkoutMutation = useCheckout(() => {
    setCart([]);
  });

  const handleSelectProduct = (producto: Producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.producto.id === producto.id);
      if (existing) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { producto, quantity: 1 }];
    });
  };

  const handleInc = (productoId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.producto.id === productoId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDec = (productoId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.producto.id === productoId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.producto.precio * item.quantity,
      0
    );
  };

  const handleConfirm = () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!sesion) {
      toast.error("No hay sesión de caja activa");
      return;
    }

    // Imprimir ticket inmediatamente — la impresora es local, no necesita internet
    printTicket(cart.map((item) => ({ name: item.producto.nombre, qty: item.quantity })));

    checkoutMutation.mutate({
      sesion_id: sesion.id,
      total: getTotal(),
      metodo_pago: "Efectivo",
      detalles: cart.map((item) => ({
        producto_id: item.producto.id,
        cantidad: item.quantity,
        precio_unitario: item.producto.precio,
        subtotal: item.producto.precio * item.quantity,
      })),
    });
  };

  if (loadingSesion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 font-semibold">Cargando...</div>
      </div>
    );
  }

  // Si no hay sesión activa, mostrar formulario para abrir caja
  if (!sesion) {
    return (
      <AbrirSesionForm
        usuarioId={user?.id}
        onSesionAbierta={(s) => setSesionLocal(s)}
      />
    );
  }

  return (
    <section className="p-10 min-h-screen">
      {/* Header del turno */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Caja Abierta
          </div>
          <span className="text-slate-500 text-sm font-medium">
            {sesion.caja?.nombre || `Caja #${sesion.caja_id}`}
          </span>
        </div>
        <CerrarSesionButton
          sesionId={sesion.id}
          onCerrada={() => {
            setSesionLocal(null);
            setCart([]);
            qc.setQueryData(["sesion-activa", user?.id], null);
            qc.removeQueries({ queryKey: ["ventas-sesion"] });
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-black text-slate-800">Nueva Venta</h1>
          </div>

          <div className="border border-slate-200 p-8 bg-white rounded-3xl shadow-sm space-y-8">
            <PosProductPicker onSelect={handleSelectProduct} />
            <div className="h-px bg-slate-100 w-full" />
            <PosCart
              cart={cart}
              onInc={handleInc}
              onDec={handleDec}
              onConfirm={handleConfirm}
              isConfirming={checkoutMutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-6">
          <PosNightSales sesionId={sesion.id} />
        </div>
      </div>
    </section>
  );
}
