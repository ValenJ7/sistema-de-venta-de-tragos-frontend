import { z } from "zod";

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
  negocio_id: number;
  rol?: { id: number; nombre: string };
  negocio?: { id: number; nombre: string };
};

export type Rol = {
  id: number;
  nombre: string;
};

export type Negocio = {
  id: number;
  nombre: string;
};

export const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password_hash: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  rol_id: z.coerce.number().min(1, "Debe seleccionar un rol"),
  negocio_id: z.coerce.number().min(1, "Debe seleccionar un negocio"),
});

export const usuarioUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password_hash: z.string().optional(),
  rol_id: z.coerce.number().min(1, "Debe seleccionar un rol"),
  negocio_id: z.coerce.number().min(1, "Debe seleccionar un negocio"),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type UsuarioUpdateFormData = z.infer<typeof usuarioUpdateSchema>;
