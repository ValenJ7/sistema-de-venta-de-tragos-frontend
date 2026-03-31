import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../shared/api/client";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mut = useMutation({
    mutationFn: async (email: string) => {
      await api.post("/auth/forgot-password", { email });
    },
    onSuccess: () => setSent(true),
    onError: () => toast.error("Error al enviar el email"),
  });

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Revisá tu email</h2>
          <p className="text-slate-500 mb-6">
            Si el email está registrado, vas a recibir un link para restablecer tu contraseña en los próximos minutos.
          </p>
          <Link to="/" className="text-orange-500 hover:text-orange-600 font-bold text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-orange-600 mb-1">Olvidé mi contraseña</h1>
        <p className="text-slate-500 text-sm mb-6">
          Ingresá tu email y te mandamos un link para crear una nueva contraseña.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); mut.mutate(email); }}
          className="space-y-4"
        >
          <input
            type="email"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
          >
            {mut.isPending ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm font-medium">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
