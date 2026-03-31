import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../api/categoria.service";
import type { CategoriaFormData } from "../types/categoria.types";

const QUERY_KEY = ["categorias"];

export function useCategorias() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getCategorias });
}

export function useCreateCategoria(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoriaFormData) => createCategoria(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Categoría creada correctamente");
      onSuccess?.();
    },
    onError: () => toast.error("Error al crear la categoría"),
  });
}

export function useUpdateCategoria(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaFormData }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Categoría actualizada correctamente");
      onSuccess?.();
    },
    onError: () => toast.error("Error al actualizar la categoría"),
  });
}

export function useDeleteCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Categoría eliminada");
    },
    onError: () => toast.error("Error al eliminar la categoría"),
  });
}
