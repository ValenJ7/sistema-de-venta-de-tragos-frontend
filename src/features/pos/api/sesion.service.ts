import api from "../../../shared/api/client";

export type SesionCaja = {
  id: number;
  caja_id: number;
  usuario_id: number;
  apertura_fecha: string;
  cierre_fecha: string | null;
  monto_inicial: number;
  monto_final_real: number | null;
  caja?: { id: number; nombre: string };
};

export type CajaDisponible = {
  id: number;
  nombre: string;
  estado: string;
};

export async function getSesionActiva(usuarioId: number): Promise<SesionCaja | null> {
  const { data } = await api.get(`/sesiones/activa?usuario_id=${usuarioId}`);
  return data.data;
}

export async function getCajasDisponibles(): Promise<CajaDisponible[]> {
  const { data } = await api.get("/sesiones/cajas-disponibles");
  return data.data;
}

export async function abrirSesion(payload: {
  usuario_id: number;
  caja_id: number;
  monto_inicial: string;
}): Promise<SesionCaja> {
  const { data } = await api.post("/sesiones", payload);
  return data.data;
}

export async function cerrarSesion(sesionId: number, montoFinalReal: string): Promise<SesionCaja> {
  const { data } = await api.put(`/sesiones/${sesionId}`, {
    monto_final_real: montoFinalReal,
  });
  return data.data;
}
