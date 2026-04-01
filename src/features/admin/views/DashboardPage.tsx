import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { getDashboard } from "../api/dashboard.service";
import { formatPrice, formatTime } from "../../../shared/utils/format";

export function DashboardPage() {
  const { data: cajas, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 5000, // Polling cada 5 segundos para tiempo real
  });


  const totalVentas = cajas?.reduce((acc, c) => acc + c.ventas_count, 0) || 0;
  const totalGeneral = cajas?.reduce((acc, c) => acc + c.ventas_total, 0) || 0;
  const cajasAbiertas = cajas?.filter((c) => c.estado === "ABIERTA").length || 0;

  if (isLoading) {
    return (
      <section className="space-y-6 pt-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl w-64" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 bg-slate-100 rounded-2xl" />
            <div className="h-64 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="pt-10 text-center">
        <p className="text-red-500 font-bold text-lg">Error al cargar el dashboard</p>
        <p className="text-slate-400 text-sm mt-1">Verifica la conexión con el servidor</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Dashboard Multi-Caja</h1>
          <p className="text-sm text-slate-500">
            Vista en tiempo real del estado de las cajas y ventas.
            <span className="inline-block ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm overflow-hidden">
            <div className="grid h-9 w-9 place-items-center">
              <ShoppingCartIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-600">Total ventas</div>
              <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                {totalVentas}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm overflow-hidden">
            <div className="grid h-9 w-9 place-items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-600">Total general</div>
              <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                {formatPrice(totalGeneral)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm overflow-hidden">
            <div className="leading-tight">
              <div className="text-sm font-medium text-emerald-700">Cajas abiertas</div>
              <div className="mt-0.5 text-2xl font-black tracking-tight text-emerald-800">
                {cajasAbiertas}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Cajas */}
      {!cajas || cajas.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-bold text-lg">No hay cajas registradas</p>
          <p className="text-sm mt-1">Crea cajas desde la API para que aparezcan aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {cajas.map((caja) => {
            const isOpen = caja.estado === "ABIERTA" && caja.sesion_activa;

            return (
              <div
                key={caja.id}
                className={`rounded-2xl border bg-white p-6 shadow-lg overflow-hidden transition-all ${
                  isOpen
                    ? "border-emerald-200 shadow-emerald-100/50"
                    : "border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black tracking-tight text-slate-900">
                      {caja.nombre}
                    </div>
                    {isOpen && caja.sesion_activa && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {caja.sesion_activa.usuario?.nombre} - desde{" "}
                        {formatTime(caja.sesion_activa.apertura_fecha)}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase shadow-sm ${
                      isOpen
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {caja.estado}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div
                    className={`rounded-2xl border p-5 ${
                      isOpen
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`text-3xl font-black tracking-tight ${
                        isOpen ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {isOpen ? caja.ventas_count : "-"}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {isOpen ? `${caja.ventas_count} ventas` : "Sin actividad"}
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border p-5 ${
                      isOpen
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`text-2xl font-black tracking-tight ${
                        isOpen ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {isOpen ? formatPrice(caja.ventas_total) : "$0.00"}
                    </div>
                  </div>
                </div>

                {isOpen && caja.sesion_activa ? (
                  <Link
                    to={`/admin/caja/${caja.sesion_activa.id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none active:scale-[0.99]"
                  >
                    Ver detalles del turno
                  </Link>
                ) : (
                  <div className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-200 py-3 text-base font-extrabold text-slate-400 cursor-not-allowed">
                    Caja Cerrada
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
