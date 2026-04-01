import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  getHistorialVentas,
  getResumenVentas,
  getCajas,
} from "../api/historial.service";
import type { HistorialFilters, HistorialVenta } from "../api/historial.service";
import { formatPrice, formatDateTime, formatDate, toInputDate } from "../../../shared/utils/format";

function getPresetDates(preset: string) {
  const hoy = new Date();
  const desde = new Date();

  switch (preset) {
    case "hoy":
      return { fecha_desde: toInputDate(hoy), fecha_hasta: toInputDate(hoy) };
    case "7dias":
      desde.setDate(desde.getDate() - 7);
      return { fecha_desde: toInputDate(desde), fecha_hasta: toInputDate(hoy) };
    case "30dias":
      desde.setDate(desde.getDate() - 30);
      return { fecha_desde: toInputDate(desde), fecha_hasta: toInputDate(hoy) };
    default:
      return {};
  }
}

export function HistorialPage() {
  const [filters, setFilters] = useState<HistorialFilters>(() => {
    const hoy = new Date();
    const hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);
    return { fecha_desde: toInputDate(hace30), fecha_hasta: toInputDate(hoy), page: 1, limit: 50 };
  });

  const [activePreset, setActivePreset] = useState("30dias");
  const [expandedVenta, setExpandedVenta] = useState<number | null>(null);

  const { data: cajas } = useQuery({
    queryKey: ["cajas-list"],
    queryFn: getCajas,
  });

  const { data: historial, isLoading } = useQuery({
    queryKey: ["historial-ventas", filters],
    queryFn: () => getHistorialVentas(filters),
  });

  const { data: resumen, isLoading: loadingResumen } = useQuery({
    queryKey: ["resumen-ventas", filters.fecha_desde, filters.fecha_hasta, filters.caja_id],
    queryFn: () =>
      getResumenVentas({
        fecha_desde: filters.fecha_desde,
        fecha_hasta: filters.fecha_hasta,
        caja_id: filters.caja_id,
      }),
  });

  const handlePreset = (preset: string) => {
    setActivePreset(preset);
    const dates = getPresetDates(preset);
    setFilters((prev) => ({ ...prev, ...dates, page: 1 }));
  };

  const handleCustomDate = (field: "fecha_desde" | "fecha_hasta", value: string) => {
    setActivePreset("");
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleCajaFilter = (cajaId: string) => {
    setFilters((prev) => ({
      ...prev,
      caja_id: cajaId ? Number(cajaId) : undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const toggleExpand = (ventaId: number) => {
    setExpandedVenta(expandedVenta === ventaId ? null : ventaId);
  };

  const ventas = historial?.data || [];
  const pagination = historial?.pagination;

  return (
    <section className="space-y-6 pt-10">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-black">Historial de Ventas</h1>
        <p className="text-sm text-slate-500">
          Consulta, filtra y analiza todas las ventas registradas.
        </p>
      </header>

      {/* Filtros */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase">
          <FunnelIcon className="w-4 h-4" />
          Filtros
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-end">
          {/* Presets */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "hoy", label: "Hoy" },
              { key: "7dias", label: "7 días" },
              { key: "30dias", label: "30 días" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => handlePreset(p.key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  activePreset === p.key
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Fechas */}
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Desde</label>
              <input
                type="date"
                value={filters.fecha_desde || ""}
                onChange={(e) => handleCustomDate("fecha_desde", e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hasta</label>
              <input
                type="date"
                value={filters.fecha_hasta || ""}
                onChange={(e) => handleCustomDate("fecha_hasta", e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            </div>
          </div>

          {/* Caja */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Caja</label>
            <select
              value={filters.caja_id || ""}
              onChange={(e) => handleCajaFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
            >
              <option value="">Todas las cajas</option>
              {cajas?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filters.fecha_desde && filters.fecha_hasta && (
          <p className="text-xs text-slate-400">
            Mostrando ventas del{" "}
            <span className="font-bold text-slate-600">
              {formatDate(filters.fecha_desde + "T12:00:00")}
            </span>{" "}
            al{" "}
            <span className="font-bold text-slate-600">
              {formatDate(filters.fecha_hasta + "T12:00:00")}
            </span>
            {filters.caja_id && cajas
              ? ` — ${cajas.find((c) => c.id === filters.caja_id)?.nombre}`
              : ""}
          </p>
        )}
      </div>

      {/* Resumen / Arqueo */}
      {loadingResumen ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : resumen ? (
        <>
          {/* Cards principales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-100">
                  <ShoppingCartIcon className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-sm font-bold text-slate-500">Total Ventas</span>
              </div>
              <div className="text-3xl font-black text-slate-900">{resumen.total_ventas}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100">
                  <CurrencyDollarIcon className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-slate-500">Monto Total</span>
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {formatPrice(resumen.monto_total)}
              </div>
            </div>

            {/* Por método de pago */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100">
                  <ChartBarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-slate-500">Por Método</span>
              </div>
              <div className="space-y-1.5">
                {resumen.por_metodo_pago.length === 0 ? (
                  <p className="text-xs text-slate-400">Sin datos</p>
                ) : (
                  resumen.por_metodo_pago.map((m) => (
                    <div key={m.metodo_pago} className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">{m.metodo_pago}</span>
                      <span className="font-bold text-slate-800">
                        {Number(m.cantidad)} ({formatPrice(Number(m.monto))})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Por caja */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-100">
                  <ChartBarIcon className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm font-bold text-slate-500">Por Caja</span>
              </div>
              <div className="space-y-1.5">
                {resumen.por_caja.length === 0 ? (
                  <p className="text-xs text-slate-400">Sin datos</p>
                ) : (
                  resumen.por_caja.map((c) => (
                    <div key={c.caja_id} className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">{c.caja_nombre}</span>
                      <span className="font-bold text-slate-800">
                        {c.cantidad} ({formatPrice(c.monto)})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Productos */}
          {resumen.top_productos.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-bold text-slate-600 uppercase">
                  Top 10 Productos Más Vendidos
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {resumen.top_productos.map((p, i) => (
                  <div
                    key={p.producto_id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-black text-white ${
                        i === 0
                          ? "bg-amber-500"
                          : i === 1
                          ? "bg-slate-400"
                          : i === 2
                          ? "bg-amber-700"
                          : "bg-slate-300"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {p.producto_nombre}
                      </p>
                      <p className="text-xs text-slate-500">
                        {p.total_cantidad} uds — {formatPrice(p.total_monto)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Tabla de ventas */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-800">Detalle de Ventas</h2>
          {pagination && (
            <span className="text-xs text-slate-400 font-bold">
              {pagination.total} ventas encontradas
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <p className="text-slate-400 font-semibold animate-pulse">Cargando ventas...</p>
          </div>
        ) : ventas.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-400 font-semibold">
              No se encontraron ventas con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Header de tabla — solo desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Fecha</div>
              <div className="col-span-2">Caja</div>
              <div className="col-span-2">Cajero</div>
              <div className="col-span-2">Método</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {ventas.map((venta: HistorialVenta) => (
              <div key={venta.id}>
                <button
                  onClick={() => toggleExpand(venta.id)}
                  className="w-full hover:bg-slate-50 transition text-left"
                >
                  {/* Mobile layout */}
                  <div className="flex items-center justify-between px-4 py-3 md:hidden">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-400 font-bold">#{venta.id}</div>
                      <div className="text-sm font-medium text-slate-700">{formatDateTime(venta.fecha)}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                          {venta.metodo_pago}
                        </span>
                        {venta.sesion?.caja?.nombre && (
                          <span className="text-xs text-slate-400">{venta.sesion.caja.nombre}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="font-black text-orange-500">{formatPrice(Number(venta.total))}</span>
                      {expandedVenta === venta.id
                        ? <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                        : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 items-center">
                    <div className="col-span-1 font-bold text-slate-400 text-sm">{venta.id}</div>
                    <div className="col-span-3 text-sm font-medium text-slate-700">{formatDateTime(venta.fecha)}</div>
                    <div className="col-span-2 text-sm text-slate-600">{venta.sesion?.caja?.nombre || "-"}</div>
                    <div className="col-span-2 text-sm text-slate-600">{venta.sesion?.usuario?.nombre || "-"}</div>
                    <div className="col-span-2">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {venta.metodo_pago}
                      </span>
                    </div>
                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                      <span className="font-black text-orange-500">{formatPrice(Number(venta.total))}</span>
                      {expandedVenta === venta.id
                        ? <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                        : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </button>

                {/* Detalle expandible */}
                {expandedVenta === venta.id && venta.detalles && (
                  <div className="px-4 md:px-5 pb-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 md:ml-6">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Productos</p>
                      <div className="space-y-1.5">
                        {venta.detalles.map((d) => (
                          <div key={d.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              <span className="font-bold text-slate-400 mr-1">x{d.cantidad}</span>
                              {d.producto?.nombre || `Producto #${d.producto_id}`}
                              <span className="text-slate-400 ml-2">@ {formatPrice(Number(d.precio_unitario))}</span>
                            </span>
                            <span className="font-bold text-slate-800">{formatPrice(Number(d.subtotal))}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between">
                        <span className="font-bold text-sm text-slate-500">Total</span>
                        <span className="font-black text-orange-500">{formatPrice(Number(venta.total))}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.pages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold">{pagination.page}</span> de{" "}
              <span className="font-bold">{pagination.pages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
