import api from "../../../shared/api/client";
import type { Producto, ProductoFormData } from "../types/producto.types";

export async function getProductos(): Promise<Producto[]> {
  const { data } = await api.get("/productos");
  return data.data;
}

export async function getProductoById(id: number): Promise<Producto> {
  const { data } = await api.get(`/productos/${id}`);
  return data.data;
}

export async function createProducto(payload: ProductoFormData): Promise<Producto> {
  const { data } = await api.post("/productos", payload);
  return data.data;
}

export async function updateProducto(id: number, payload: ProductoFormData): Promise<Producto> {
  const { data } = await api.put(`/productos/${id}`, payload);
  return data.data;
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}
