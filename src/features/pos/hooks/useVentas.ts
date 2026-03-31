import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getVentas,
  createVentaCompleta,
} from "../api/venta.service";
import type { VentaFormData } from "../types/venta.types";

const PRINTER_API_URL = "http://localhost:3333";

export async function printTicket(cartItems: { name: string; qty: number }[]) {
  try {
    const payload = {
      sale: {
        items: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
        })),
      },
    };
    await axios.post(`${PRINTER_API_URL}/print-ticket`, payload);
  } catch (error) {
    console.error("Error al imprimir el ticket en el helper local:", error);
  }
}

const QUERY_KEY = ["ventas"];

export function useVentas() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getVentas });
}

export function useCheckout(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: VentaFormData) => {
      return createVentaCompleta(data);
    },
    onSuccess: (venta) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["ventas-sesion"] });
      toast.success("Venta registrada con éxito", {
        description: "Los detalles fueron guardados.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al procesar la venta");
    },
  });
}
