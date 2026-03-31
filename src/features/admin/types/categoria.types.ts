import { z } from "zod";

export type Categoria = {
  id: number;
  nombre: string;
};

export const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;
