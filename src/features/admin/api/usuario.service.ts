import api from "../../../shared/api/client";
import type { Usuario, UsuarioFormData, Rol, Negocio } from "../types/usuario.types";

export async function getUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get("/usuarios");
  return data.data;
}

export async function createUsuario(payload: UsuarioFormData): Promise<Usuario> {
  const { data } = await api.post("/usuarios", payload);
  return data.data;
}

export async function updateUsuario(id: number, payload: any): Promise<Usuario> {
  const { data } = await api.put(`/usuarios/${id}`, payload);
  return data.data;
}

export async function deactivateUsuario(id: number): Promise<void> {
  await api.patch(`/usuarios/${id}/deactivate`);
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

export async function getRoles(): Promise<Rol[]> {
  const { data } = await api.get("/roles");
  return data.data;
}

export async function getNegocios(): Promise<Negocio[]> {
  const { data } = await api.get("/negocios");
  return data.data;
}
