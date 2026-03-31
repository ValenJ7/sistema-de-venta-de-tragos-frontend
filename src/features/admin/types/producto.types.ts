import { z } from "zod";
import type { Categoria } from "./categoria.types";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  categoria?: Categoria; // From eager loading the BelongsTo relationship
};

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre del producto es obligatorio"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  categoria_id: z.coerce.number().min(1, "Debe seleccionar una categoría"),
});

export type ProductoFormData = z.infer<typeof productoSchema>;
