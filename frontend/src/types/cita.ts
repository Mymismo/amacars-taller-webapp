import { Usuario } from './usuario';
import { Servicio } from './servicio';
import { Vehiculo } from './vehiculo';

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'EN_PROCESO' | 'COMPLETADA';

export interface CitaBase {
  fecha_hora: string;
  notas_cliente?: string;
  usuario_id: number;
  vehiculo_id: number;
  servicios_ids: number[];
}

export interface CitaCreate extends CitaBase {}

export interface CitaUpdate extends Partial<CitaBase> {
  estado?: EstadoCita;
  notas_tecnico?: string;
  tecnico_asignado_id?: number;
}

export interface Cita extends CitaBase {
  id: number;
  estado: EstadoCita;
  notas_tecnico?: string;
  tecnico_asignado_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CitaWithRelations extends Cita {
  usuario?: Usuario;
  vehiculo?: Vehiculo;
  servicios: Servicio[];
  tecnico_asignado?: Usuario;
} 