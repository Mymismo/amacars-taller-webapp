export interface Usuario {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  rol: 'admin' | 'tecnico' | 'cliente';
  activo: boolean;
  fecha_registro: string;
  ultima_conexion?: string;
  grupo_id?: number;
}

export interface Vehiculo {
  id?: number;
  usuario_id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  color: string;
  vin?: string;
  kilometraje: number;
  fecha_ultimo_servicio?: string;
  notas?: string;
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  duracion_estimada: number;
  categoria: string;
  requiere_cita: boolean;
  disponible: boolean;
}

export interface Cita {
  id?: number;
  usuario_id: number;
  vehiculo_id: number;
  fecha_hora: string;
  servicios: number[];
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  notas_cliente?: string;
  notas_taller?: string;
  tecnico_asignado?: number;
  presupuesto_id?: number;
}

export interface Presupuesto {
  id?: number;
  cita_id?: number;
  usuario_id: number;
  vehiculo_id: number;
  fecha_emision: string;
  fecha_validez: string;
  items: PresupuestoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'expirado';
  notas?: string;
}

export interface PresupuestoItem {
  servicio_id: number;
  cantidad: number;
  precio_unitario: number;
  descripcion?: string;
}

export interface Notificacion {
  id?: number;
  usuario_id: number;
  tipo: 'sistema' | 'cita' | 'presupuesto' | 'servicio' | 'promocion';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  accion?: string;
  grupo_id?: number;
}

export interface GrupoClientes {
  id?: number;
  nombre: string;
  descripcion?: string;
  usuarios: number[];
}

export interface HistorialServicio {
  id?: number;
  cita_id: number;
  vehiculo_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  servicios_realizados: ServicioRealizado[];
  kilometraje: number;
  tecnico_id: number;
  notas: string;
  costo_total: number;
}

export interface ServicioRealizado {
  servicio_id: number;
  descripcion: string;
  costo: number;
  piezas_utilizadas?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
}

export interface DashboardStats {
  citas_pendientes: number;
  servicios_en_proceso: number;
  ingresos_mes: number;
  clientes_nuevos: number;
  satisfaccion_promedio: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 