import api from "../../../shared/api/client";
import type { Negocio, NegocioFormData } from "../types/negocio.types";

export async function getNegocios(): Promise<Negocio[]> {
  const { data } = await api.get("/negocios");
  return data.data;
}

export async function createNegocio(payload: NegocioFormData): Promise<{ negocio: Negocio; admin: any }> {
  const { data } = await api.post("/negocios", payload);
  return data.data;
}

export async function updateNegocio(id: number, payload: Partial<Negocio>): Promise<Negocio> {
  const { data } = await api.put(`/negocios/${id}`, payload);
  return data.data;
}

export async function deleteNegocio(id: number): Promise<void> {
  await api.delete(`/negocios/${id}`);
}

export async function suspenderNegocio(id: number): Promise<Negocio> {
  const { data } = await api.patch(`/negocios/${id}/suspender`);
  return data.data;
}

export async function activarNegocio(id: number): Promise<Negocio> {
  const { data } = await api.patch(`/negocios/${id}/activar`);
  return data.data;
}
