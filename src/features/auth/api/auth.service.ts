import api from "../../../shared/api/client";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol_id: number;
    rol_nombre: string;
    negocio_id: number;
    negocio_nombre?: string;
  };
};

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}
