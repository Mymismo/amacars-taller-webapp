export type RolUsuario = 'ADMIN' | 'CLIENTE' | 'MECANICO';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  rol: RolUsuario;
  activo: boolean;
  created_at: string;
  updated_at: string;
} 