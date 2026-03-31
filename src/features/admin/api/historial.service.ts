import api from "../../../shared/api/client";

export type HistorialVenta = {
  id: number;
  total: number;
  metodo_pago: string;
  fecha: string;
  sesion: {
    id: number;
    caja_id: number;
    caja: { id: number; nombre: string };
    usuario: { id: number; nombre: string };
  };
  detalles: {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: { id: number; nombre: string; precio: number };
  }[];
};

export type HistorialPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type ResumenVentas = {
  total_ventas: number;
  monto_total: number;
  por_metodo_pago: {
    metodo_pago: string;
    cantidad: number;
    monto: number;
  }[];
  por_caja: {
    caja_id: number;
    caja_nombre: string;
    cantidad: number;
    monto: number;
  }[];
  top_productos: {
    producto_id: number;
    producto_nombre: string;
    total_cantidad: number;
    total_monto: number;
  }[];
};

export type HistorialFilters = {
  fecha_desde?: string;
  fecha_hasta?: string;
  caja_id?: number;
  metodo_pago?: string;
  page?: number;
  limit?: number;
};

export async function getHistorialVentas(
  filters: HistorialFilters
): Promise<{ data: HistorialVenta[]; pagination: HistorialPagination }> {
  const params = new URLSearchParams();
  if (filters.fecha_desde) params.set("fecha_desde", filters.fecha_desde);
  if (filters.fecha_hasta) params.set("fecha_hasta", filters.fecha_hasta);
  if (filters.caja_id) params.set("caja_id", String(filters.caja_id));
  if (filters.metodo_pago) params.set("metodo_pago", filters.metodo_pago);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const { data } = await api.get(`/historial/ventas?${params.toString()}`);
  return data;
}

export async function getResumenVentas(
  filters: Pick<HistorialFilters, "fecha_desde" | "fecha_hasta" | "caja_id">
): Promise<ResumenVentas> {
  const params = new URLSearchParams();
  if (filters.fecha_desde) params.set("fecha_desde", filters.fecha_desde);
  if (filters.fecha_hasta) params.set("fecha_hasta", filters.fecha_hasta);
  if (filters.caja_id) params.set("caja_id", String(filters.caja_id));

  const { data } = await api.get(`/historial/resumen?${params.toString()}`);
  return data.data;
}

export async function getCajas(): Promise<{ id: number; nombre: string }[]> {
  const { data } = await api.get("/cajas");
  return data.data;
}
