import { useQuery } from "@tanstack/react-query";
import { getVentasBySesion } from "../api/venta.service";
import { formatPrice, formatTime } from "../../../shared/utils/format";
type Props = {
  sesionId: number;
};

export function PosNightSales({ sesionId }: Props) {
  const { data: ventas, isLoading } = useQuery({
    queryKey: ["ventas-sesion", sesionId],
    queryFn: () => getVentasBySesion(sesionId),
    refetchInterval: 5000,
  });

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-3xl font-black text-slate-800">Historial de Turno</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <p className="text-center text-slate-500 font-bold p-10">Cargando ventas...</p>
          ) : !ventas || ventas.length === 0 ? (
            <p className="text-center text-slate-400 font-semibold p-10">
              No hay ventas registradas aún en este turno.
            </p>
          ) : (
            <div className="space-y-4 p-2">
              {ventas.map((venta) => {
                const detalles = venta.detalles || (venta as any).VentaDetalles || [];
                const nombres = detalles
                  .map((d: any) => d.producto?.nombre || d.Producto?.nombre || `Producto ${d.producto_id}`)
                  .join(" · ");
                return (
                <div
                  key={venta.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-extrabold text-slate-800 text-lg">
                        {nombres || `Venta #${venta.id}`}
                      </span>
                      <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                        {formatTime(venta.fecha)} hs - {venta.metodo_pago}
                      </p>
                    </div>
                    <span className="text-xl font-black text-orange-500">
                      {formatPrice(Number(venta.total))}
                    </span>
                  </div>

                  {detalles.length > 1 && <div className="space-y-1 mt-3 pt-3 border-t border-slate-200">
                    {detalles.map((detalle: any) => {
                      const productName =
                        detalle.producto?.nombre ||
                        (detalle as any).Producto?.nombre ||
                        `Producto ${detalle.producto_id}`;
                      return (
                        <div key={detalle.id} className="flex justify-between items-center text-sm">
                          <p className="font-semibold text-slate-600 truncate max-w-[180px]">
                            <span className="text-slate-400 font-bold mr-1">x{detalle.cantidad}</span>
                            {productName}
                          </p>
                          <p className="font-bold text-slate-500 ml-2">
                            {formatPrice(Number(detalle.subtotal))}
                          </p>
                        </div>
                      );
                    })}
                  </div>}
                </div>
              );
              })}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-slate-500 font-bold">{ventas?.length || 0} ventas</span>
        </div>
      </div>
    </div>
  );
}
