import { Servicio } from '../servicios/types';

export enum EstadoCita {
    PENDIENTE = 'pendiente',
    CONFIRMADA = 'confirmada',
    EN_PROCESO = 'en_proceso',
    COMPLETADA = 'completada',
    CANCELADA = 'cancelada'
}

export interface Cliente {
    id: number;
    nombre_completo: string;
    email: string;
    telefono: string;
}

export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    matricula: string;
    color: string;
    usuario_id: number;
}

export interface Cita {
    id: number;
    fecha_hora: string;
    estado: EstadoCita;
    notas_cliente?: string;
    usuario_id: number;
    vehiculo_id: number;
    tecnico_asignado_id?: number;
    servicios: Servicio[];
    // Relaciones expandidas
    usuario?: Cliente;
    vehiculo?: Vehiculo;
    tecnico_asignado?: Cliente;
}

export interface CitaCreate {
    fecha_hora: string;
    usuario_id: number;
    vehiculo_id: number;
    servicios_ids: number[];
    notas_cliente?: string;
}

export interface CitaUpdate extends Partial<CitaCreate> {
    estado?: EstadoCita;
    tecnico_asignado_id?: number;
}

export interface CitaFiltros {
    fecha?: string;
    estado?: EstadoCita;
    usuario_id?: number;
    tecnico_id?: number;
    servicio_id?: number;
}

export interface HorarioDisponible {
    hora: string;
    disponible: boolean;
} 