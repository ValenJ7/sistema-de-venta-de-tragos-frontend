import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/producto.service";
import type { ProductoFormData } from "../types/producto.types";

const QUERY_KEY = ["productos"];

export function useProductos() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getProductos });
}

export function useCreateProducto(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductoFormData) => createProducto(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Producto creado correctamente");
      onSuccess?.();
    },
    onError: () => toast.error("Error al crear el producto"),
  });
}

export function useUpdateProducto(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoFormData }) =>
      updateProducto(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Producto actualizado correctamente");
      onSuccess?.();
    },
    onError: () => toast.error("Error al actualizar el producto"),
  });
}

export function useDeleteProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Producto eliminado");
    },
    onError: () => toast.error("Error al eliminar el producto"),
  });
}
