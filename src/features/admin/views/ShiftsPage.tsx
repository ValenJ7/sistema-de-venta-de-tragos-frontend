import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetalleSesion } from "../api/dashboard.service";
import { formatPrice, formatTime } from "../../../shared/utils/format";

export function ShiftsPage() {
  const { cashierUserId } = useParams();
  const sesionId = Number(cashierUserId);

  const { data: sesion, isLoading, isError } = useQuery({
    queryKey: ["detalle-sesion", sesionId],
    queryFn: () => getDetalleSesion(sesionId),
    enabled: !!sesionId,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <section className="pt-10 text-center">
        <p className="text-slate-400 font-bold">Cargando detalle...</p>
      </section>
    );
  }

  if (isError || !sesion) {
    return (
      <section className="pt-10 text-center space-y-4">
        <p className="text-red-500 font-bold text-lg">Sesión no encontrada</p>
        <Link
          to="/admin/dashboard"
          className="inline-block bg-slate-800 text-white px-6 py-3 rounded-xl font-bold"
        >
          Volver al Dashboard
        </Link>
      </section>
    );
  }

  const ventas = sesion.Ventas || [];
  const totalVentas = ventas.reduce((acc: number, v: any) => acc + Number(v.total), 0);
  const isActive = !sesion.cierre_fecha;

  return (
    <section className="space-y-6 pt-10 max-w-3xl mx-auto">
      <header className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
              isActive
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            {isActive ? "En curso" : "Finalizado"}
          </span>
          {isActive && (
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </div>

        <h1 className="text-3xl font-black">
          {sesion.caja?.nombre || `Caja #${sesion.caja_id}`}
        </h1>
        <p className="text-sm text-gray-600">
          Cajero: <span className="font-black text-black">{sesion.usuario?.nombre}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Apertura: {formatTime(sesion.apertura_fecha)}
          {sesion.cierre_fecha && ` — Cierre: ${formatTime(sesion.cierre_fecha)}`}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <div className="text-2xl font-black text-orange-600">{formatPrice(totalVentas)}</div>
            <div className="text-xs text-slate-500 font-bold mt-1">Total vendido</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-2xl font-black text-slate-800">{ventas.length}</div>
            <div className="text-xs text-slate-500 font-bold mt-1">Ventas</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-2xl font-black text-slate-800">
              {formatPrice(Number(sesion.monto_inicial))}
            </div>
            <div className="text-xs text-slate-500 font-bold mt-1">Monto inicial</div>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-orange-100">
          {ventas.length === 0 ? (
            <div className="p-10 text-center text-slate-300 italic text-sm">
              Sin ventas registradas en este turno
            </div>
          ) : (
            ventas.map((venta: any) => (
              <div key={venta.id} className="p-4">
                <div className="flex justify-between font-black">
                  <span>
                    Venta #{venta.id}
                    <span className="ml-2 text-xs text-slate-400 font-bold">
                      {formatTime(venta.fecha)} - {venta.metodo_pago}
                    </span>
                  </span>
                  <span className="text-orange-600">{formatPrice(Number(venta.total))}</span>
                </div>
                {venta.VentaDetalles && (
                  <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                    {venta.VentaDetalles.map((d: any) => (
                      <div key={d.id} className="flex justify-between">
                        <span>
                          x{d.cantidad} {d.Producto?.nombre || `Producto #${d.producto_id}`}
                        </span>
                        <span className="font-bold">{formatPrice(Number(d.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        to="/admin/dashboard"
        className="w-full h-12 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center transition hover:bg-slate-700"
      >
        Volver al Dashboard
      </Link>
    </section>
  );
}
