import { Usuario } from './usuario';
import { Vehiculo } from './vehiculo';

export enum EstadoCita {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    EN_PROCESO = 'EN_PROCESO',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA'
}

export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    duracion: number; // en minutos
    precio: number;
    created_at?: string;
    updated_at?: string;
}

export interface Cita {
    id: string;
    fecha: string;
    hora: string;
    estado: EstadoCita;
    notas?: string;
    cliente: Usuario;
    mecanico?: Usuario;
    vehiculo: Vehiculo;
    servicio: Servicio;
    created_at?: string;
    updated_at?: string;
}

export interface CitaInput {
    fecha: string;
    hora: string;
    cliente_id: string;
    vehiculo_id: string;
    servicio_id: string;
    notas?: string;
}

export interface ActualizarEstadoCitaInput {
    citaId: string;
    estado: EstadoCita;
    notas?: string;
} 