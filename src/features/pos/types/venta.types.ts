import { z } from "zod";
export type VentaDetalle = {
  id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: { nombre: string; };
  Producto?: { nombre: string; };
};

export type Venta = {
  id: number;
  sesion_id: number;
  total: number;
  metodo_pago: string;
  fecha: string;
  detalles?: VentaDetalle[];
};

export const ventaDetalleSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive().min(1),
  precio_unitario: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
});

export const ventaSchema = z.object({
  sesion_id: z.number().int().positive(), // Hardcoded to 1 for now in the UI
  total: z.number().nonnegative(),
  metodo_pago: z.string().min(1, "El método de pago es obligatorio"),
  detalles: z.array(ventaDetalleSchema).min(1, "La venta debe tener al menos un detalle"),
});

export type VentaFormData = z.infer<typeof ventaSchema>;
export type VentaDetalleFormData = z.infer<typeof ventaDetalleSchema>;
