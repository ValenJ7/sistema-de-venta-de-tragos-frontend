import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deactivateUsuario,
  getRoles,
  getNegocios,
} from "../api/usuario.service";
import type { UsuarioFormData } from "../types/usuario.types";

const QUERY_KEY = ["usuarios"];

export function useUsuarios() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getUsuarios });
}

export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: getRoles });
}

export function useNegocios() {
  return useQuery({ queryKey: ["negocios"], queryFn: getNegocios });
}

export function useCreateUsuario(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UsuarioFormData) => createUsuario(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Usuario creado correctamente");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al crear el usuario";
      toast.error(msg);
    },
  });
}

export function useUpdateUsuario(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateUsuario(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Usuario actualizado correctamente");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al actualizar el usuario";
      toast.error(msg);
    },
  });
}

export function useDeactivateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateUsuario(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Usuario desactivado");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al desactivar el usuario";
      toast.error(msg);
    },
  });
}
