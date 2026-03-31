import { Navigate } from "react-router-dom";
import { useAppStore } from "../../app/stores/useAppStore";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const user = useAppStore((s: any) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol_nombre)) {
    if (user.rol_nombre === "superadmin") {
      return <Navigate to="/admin/negocios" replace />;
    }
    if (user.rol_nombre === "cajero") {
      return <Navigate to="/pos" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
