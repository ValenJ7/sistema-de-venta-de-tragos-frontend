import api from "../../../shared/api/client";
import type { Venta, VentaFormData } from "../types/venta.types";

export async function getVentas(): Promise<Venta[]> {
  const { data } = await api.get("/ventas");
  return data.data;
}

export async function getVentaById(id: number): Promise<Venta> {
  const { data } = await api.get(`/ventas/${id}`);
  return data.data;
}

export async function createVentaCompleta(payload: VentaFormData): Promise<Venta> {
  const { data } = await api.post("/ventas", payload);
  return data.data;
}

export async function getVentasBySesion(sesionId: number): Promise<Venta[]> {
  const { data } = await api.get(`/sesiones/${sesionId}/ventas`);
  return data.data;
}
