// Tipos de usuario y autenticación
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  rol: 'admin' | 'mecanico' | 'cliente';
  is_active: boolean;
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
  ano: number;
  placa: string;
  vin: string;
  color: string;
  cliente_id: number;
  notas?: string;
  usuario: User;
}

// Tipos de servicio
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  activo: boolean;
}

// Tipos de cita
export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  servicio: Servicio;
  usuario: User;
  vehiculo: Vehiculo;
  notas?: string;
}

// Tipos de presupuesto
export interface Presupuesto {
  id: number;
  cita_id: number;
  total: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
  fecha_emision: string;
  fecha_validez: string;
  detalles: string;
}

// Enums
export enum RolUsuario {
    ADMIN = 'ADMIN',
    TECNICO = 'TECNICO',
    CLIENTE = 'CLIENTE'
}

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
    CITA = 'CITA',
    PRESUPUESTO = 'PRESUPUESTO',
    SISTEMA = 'SISTEMA'
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
    usuario_id: number;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fecha_creacion: string;
    fecha_lectura?: string;
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
    user: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
} 