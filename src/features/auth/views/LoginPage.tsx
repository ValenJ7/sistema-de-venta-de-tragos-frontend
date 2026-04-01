import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "../../../app/stores/useAppStore";
import { loginRequest } from "../api/auth.service";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAppStore((s: any) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await loginRequest({ email, password });
      setSession(user, token);

      if (user.rol_nombre === "superadmin") {
        navigate("/admin/negocios");
      } else if (user.rol_nombre === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || "Error al iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md w-full mx-4 sm:mx-auto mt-8 sm:mt-20 p-6 sm:p-10 bg-white rounded-2xl border shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-800 italic">COCKTAIL</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">
          Management System
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="email"
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 py-4 rounded-xl text-white font-black uppercase shadow-lg shadow-orange-200 transition-all"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-slate-400 hover:text-orange-500 text-sm font-medium transition">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </section>
  );
}
