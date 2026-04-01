export type Negocio = {
  id: number;
  nombre: string;
  config_moneda: string;
  activo: boolean;
  usuarios?: { id: number; nombre: string; email: string; activo: boolean; Rol?: { nombre: string } }[];
  cajas?: { id: number; nombre: string; estado: string }[];
};

export type NegocioFormData = {
  nombre: string;
  config_moneda: string;
  admin_nombre: string;
  admin_email: string;
  admin_password: string;
};
