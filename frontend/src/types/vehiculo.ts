import { Usuario } from './usuario';

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  matricula: string;
  kilometraje: number;
  color?: string;
  tipo?: string;
  cliente_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface VehiculoInput {
  marca: string;
  modelo: string;
  anio: number | string;
  matricula: string;
  kilometraje: number | string;
  color?: string;
  tipo?: string;
  cliente_id: string;
}

export interface VehiculoFilter {
  marca?: string;
  modelo?: string;
  anio?: number;
  matricula?: string;
  cliente_id?: string;
} 