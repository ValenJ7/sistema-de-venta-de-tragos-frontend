import api from "../../../shared/api/client";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get("/categorias");
  return data.data;
}

export async function createCategoria(payload: CategoriaFormData): Promise<Categoria> {
  const { data } = await api.post("/categorias", payload);
  return data.data;
}

export async function updateCategoria(id: number, payload: CategoriaFormData): Promise<Categoria> {
  const { data } = await api.put(`/categorias/${id}`, payload);
  return data.data;
}

export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}
