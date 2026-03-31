import api from "../../../shared/api/client";

export type DashboardCaja = {
  id: number;
  nombre: string;
  estado: string;
  sesion_activa: {
    id: number;
    usuario: { id: number; nombre: string; email: string };
    apertura_fecha: string;
    monto_inicial: number;
  } | null;
  ventas_count: number;
  ventas_total: number;
};

export type DetalleSesion = {
  id: number;
  caja_id: number;
  usuario_id: number;
  apertura_fecha: string;
  cierre_fecha: string | null;
  monto_inicial: number;
  monto_final_real: number | null;
  usuario: { id: number; nombre: string; email: string };
  caja: { id: number; nombre: string };
  Ventas: any[];
};

export async function getDashboard(): Promise<DashboardCaja[]> {
  const { data } = await api.get("/dashboard");
  return data.data;
}

export async function getDetalleSesion(sesionId: number): Promise<DetalleSesion> {
  const { data } = await api.get(`/dashboard/sesion/${sesionId}`);
  return data.data;
}
