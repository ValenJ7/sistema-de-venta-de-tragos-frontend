import type { CartItem } from "../views/PosPage";
import { formatPrice } from "../../../shared/utils/format";

type Props = {
  cart: CartItem[];
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onConfirm: () => void;
  isConfirming: boolean;
};

export function PosCart({ cart, onInc, onDec, onConfirm, isConfirming }: Props) {
  const total = cart.reduce(
    (acc, item) => acc + item.producto.precio * item.quantity,
    0
  );

  return (
    <div className="mt-6 flex flex-col h-full">
      <h2 className="text-xl font-black text-slate-800">Carrito Actual</h2>

      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/30 p-4 flex-1 flex flex-col max-h-[400px]">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="font-semibold text-lg">Carrito vacío</p>
            <p className="text-sm mt-1">
              Buscá y seleccioná un producto arriba para agregarlo a la venta actual.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {cart.map((item) => (
              <div
                key={item.producto.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-white border border-orange-100 p-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-800 truncate leading-tight">
                    {item.producto.nombre}
                  </p>
                  <p className="text-xs text-orange-600 font-bold mt-1">
                    {formatPrice(item.producto.precio)} c/u
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-100">
                  <button
                    onClick={() => onDec(item.producto.id)}
                    className="w-8 h-8 rounded-md bg-white border border-slate-200 font-black text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition shadow-sm flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onInc(item.producto.id)}
                    className="w-8 h-8 rounded-md bg-white border border-slate-200 font-black text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition shadow-sm flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="text-right shrink-0 min-w-[5rem]">
                  <p className="font-black text-slate-800">
                    {formatPrice(item.producto.precio * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between px-2">
        <p className="text-xl font-black text-slate-800">Total:</p>
        <p className="text-4xl font-black text-orange-500">
          {formatPrice(total)}
        </p>
      </div>

      <button
        type="button"
        disabled={cart.length === 0 || isConfirming}
        onClick={onConfirm}
        className="mt-6 w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-sm shadow-orange-200 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors"
      >
        {isConfirming ? "Procesando..." : "Confirmar Venta"}
      </button>
    </div>
  );
}