import { Usuario } from './usuario';

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  color?: string;
  kilometraje?: number;
  vin?: string;
  usuario_id: number;
  usuario?: Usuario;
  activo: boolean;
  created_at: string;
  updated_at: string;
} 