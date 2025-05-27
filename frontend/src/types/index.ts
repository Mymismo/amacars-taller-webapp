// Tipos de usuario y autenticación
export type RolUsuario = 'ADMIN' | 'MECANICO' | 'RECEPCIONISTA' | 'CLIENTE';

export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  rol: string;
  activo: boolean;
  telefono?: string;
  direccion?: string;
}

export interface UserUpdate {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
  apellidos: string;
  telefono: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Tipos de vehículo
export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
  matricula: string;
  kilometraje: string;
  color: string;
  tipo: string;
  cliente_id: number;
  fecha_registro: string;
}

// Tipos de servicio
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_estimada: number;
  activo: boolean;
}

// Tipos de cita
export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  notas?: string;
  cliente_id: number;
  vehiculo_id: number;
  mecanico_id?: number;
  servicio_id: number;
  cliente?: User;
  vehiculo?: Vehiculo;
  mecanico?: User;
}

// Tipos de presupuesto
export interface Presupuesto {
  id: number;
  cita_id: number;
  descripcion: string;
  mano_obra: number;
  coste_piezas: number;
  total: number;
  estado: EstadoPresupuesto;
  fecha_emision: string;
  fecha_validez: string;
  notas?: string;
}

// Enums
export enum EstadoCita {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    EN_PROCESO = 'EN_PROCESO',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA'
}

export enum EstadoPresupuesto {
    PENDIENTE = 'PENDIENTE',
    ACEPTADO = 'ACEPTADO',
    RECHAZADO = 'RECHAZADO'
}

export enum TipoServicio {
    MANTENIMIENTO = 'MANTENIMIENTO',
    REPARACION = 'REPARACION',
    DIAGNOSTICO = 'DIAGNOSTICO',
    REVISION = 'REVISION'
}

export enum TipoNotificacion {
    INFO = 'INFO',
    EXITO = 'EXITO',
    ADVERTENCIA = 'ADVERTENCIA',
    ERROR = 'ERROR'
}

export enum EstadoNotificacion {
    NO_LEIDA = 'NO_LEIDA',
    LEIDA = 'LEIDA'
}

// Interfaces
export interface Usuario {
    id: number;
    email: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    rol: RolUsuario;
    activo: boolean;
    fecha_registro: string;
}

export interface Vehiculo {
    id: number;
    propietario_id: number;
    marca: string;
    modelo: string;
    anio: number;
    matricula: string;
    kilometraje: number;
    tipo: string;
    fecha_registro: string;
}

export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: TipoServicio;
    precio_base: number;
    duracion_estimada: number;
    activo: boolean;
}

export interface Cita {
    id: number;
    cliente_id: number;
    vehiculo_id: number;
    servicio_id: number;
    tecnico_id?: number;
    fecha: string;
    hora: string;
    estado: EstadoCita;
    notas?: string;
    fecha_registro: string;
}

export interface Presupuesto {
    id: number;
    cita_id: number;
    descripcion: string;
    mano_obra: number;
    coste_piezas: number;
    total: number;
    estado: EstadoPresupuesto;
    fecha_emision: string;
    fecha_validez: string;
    notas?: string;
}

export interface GrupoClientes {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_creacion: string;
}

export interface Notificacion {
    id: number;
    titulo: string;
    mensaje: string;
    tipo: TipoNotificacion;
    leida: boolean;
    fecha: string;
    usuario_id: number;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Estado de autenticación
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
} 