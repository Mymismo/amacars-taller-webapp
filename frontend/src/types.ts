export interface User {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
    rol: 'ADMIN' | 'MECANICO' | 'CLIENTE';
    email_verificado: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export enum EstadoCita {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    EN_PROCESO = 'EN_PROCESO',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA'
}

export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
}

export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    placa: string;
    color: string;
    cliente_id: number;
}

export interface Cita {
    id: number;
    fecha: string;
    hora: string;
    estado: EstadoCita;
    servicio: Servicio;
    vehiculo: Vehiculo;
    cliente_id: number;
    mecanico_id?: number;
    notas?: string;
    created_at: string;
    updated_at: string;
} 