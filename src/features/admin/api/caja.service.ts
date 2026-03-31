import api from "../../../shared/api/client";

export type Caja = {
  id: number;
  nombre: string;
  estado: string;
  negocio_id: number;
};

export async function getCajas(): Promise<Caja[]> {
  const { data } = await api.get("/cajas");
  return data.data;
}

export async function createCaja(nombre: string): Promise<Caja> {
  const { data } = await api.post("/cajas", { nombre });
  return data.data;
}

export async function updateCaja(id: number, nombre: string): Promise<Caja> {
  const { data } = await api.put(`/cajas/${id}`, { nombre });
  return data.data;
}

export async function deleteCaja(id: number): Promise<void> {
  await api.delete(`/cajas/${id}`);
}
