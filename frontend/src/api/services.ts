import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Usuario,
  Vehiculo,
  Servicio,
  Cita,
  Presupuesto,
  Notificacion,
  GrupoClientes,
  HistorialServicio,
  ApiResponse,
  AuthState
} from '../types';

// Configuración del cliente axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  login: (email: string, password: string) => 
    api.post<ApiResponse<AuthState>>('/auth/login', { email, password }),
  
  register: (userData: Partial<Usuario>) => 
    api.post<ApiResponse<Usuario>>('/auth/register', userData),
  
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  
  refreshToken: () => api.post<ApiResponse<{ token: string }>>('/auth/refresh'),
  
  resetPassword: (email: string) => 
    api.post<ApiResponse<null>>('/auth/reset-password', { email }),
};

// Servicio genérico CRUD
const createCrudService = <T>(endpoint: string) => ({
  getAll: (params?: any) => 
    api.get<ApiResponse<T[]>>(`/${endpoint}`, { params }),
  
  getById: (id: number) => 
    api.get<ApiResponse<T>>(`/${endpoint}/${id}`),
  
  create: (data: Partial<T>) => 
    api.post<ApiResponse<T>>(`/${endpoint}`, data),
  
  update: (id: number, data: Partial<T>) => 
    api.put<ApiResponse<T>>(`/${endpoint}/${id}`, data),
  
  delete: (id: number) => 
    api.delete<ApiResponse<null>>(`/${endpoint}/${id}`),
});

// Servicios específicos
export const usuariosService = {
  ...createCrudService<Usuario>('usuarios'),
  updateProfile: (id: number, data: Partial<Usuario>) =>
    api.put<ApiResponse<Usuario>>(`/usuarios/${id}/profile`, data),
  changePassword: (id: number, oldPassword: string, newPassword: string) =>
    api.put<ApiResponse<null>>(`/usuarios/${id}/password`, { oldPassword, newPassword }),
};

export const vehiculosService = {
  ...createCrudService<Vehiculo>('vehiculos'),
  getByUsuario: (usuarioId: number) =>
    api.get<ApiResponse<Vehiculo[]>>(`/usuarios/${usuarioId}/vehiculos`),
  updateKilometraje: (id: number, kilometraje: number) =>
    api.put<ApiResponse<Vehiculo>>(`/vehiculos/${id}/kilometraje`, { kilometraje }),
};

export const serviciosService = {
  ...createCrudService<Servicio>('servicios'),
  getDisponibles: () =>
    api.get<ApiResponse<Servicio[]>>('/servicios/disponibles'),
  getPorCategoria: (categoria: string) =>
    api.get<ApiResponse<Servicio[]>>(`/servicios/categoria/${categoria}`),
};

export const citasService = {
  ...createCrudService<Cita>('citas'),
  getByUsuario: (usuarioId: number) =>
    api.get<ApiResponse<Cita[]>>(`/usuarios/${usuarioId}/citas`),
  confirmar: (id: number) =>
    api.put<ApiResponse<Cita>>(`/citas/${id}/confirmar`),
  cancelar: (id: number, motivo?: string) =>
    api.put<ApiResponse<Cita>>(`/citas/${id}/cancelar`, { motivo }),
  asignarTecnico: (id: number, tecnicoId: number) =>
    api.put<ApiResponse<Cita>>(`/citas/${id}/tecnico`, { tecnico_id: tecnicoId }),
};

export const presupuestosService = {
  ...createCrudService<Presupuesto>('presupuestos'),
  getByUsuario: (usuarioId: number) =>
    api.get<ApiResponse<Presupuesto[]>>(`/usuarios/${usuarioId}/presupuestos`),
  aceptar: (id: number) =>
    api.put<ApiResponse<Presupuesto>>(`/presupuestos/${id}/aceptar`),
  rechazar: (id: number, motivo?: string) =>
    api.put<ApiResponse<Presupuesto>>(`/presupuestos/${id}/rechazar`, { motivo }),
};

export const notificacionesService = {
  ...createCrudService<Notificacion>('notificaciones'),
  getByUsuario: (usuarioId: number) =>
    api.get<ApiResponse<Notificacion[]>>(`/usuarios/${usuarioId}/notificaciones`),
  marcarComoLeida: (id: number) =>
    api.put<ApiResponse<Notificacion>>(`/notificaciones/${id}/leer`),
  enviarAGrupo: (grupoId: number, notificacion: Partial<Notificacion>) =>
    api.post<ApiResponse<Notificacion[]>>(`/grupos/${grupoId}/notificaciones`, notificacion),
};

export const gruposService = {
  ...createCrudService<GrupoClientes>('grupos'),
  addUsuario: (grupoId: number, usuarioId: number) =>
    api.post<ApiResponse<GrupoClientes>>(`/grupos/${grupoId}/usuarios`, { usuario_id: usuarioId }),
  removeUsuario: (grupoId: number, usuarioId: number) =>
    api.delete<ApiResponse<GrupoClientes>>(`/grupos/${grupoId}/usuarios/${usuarioId}`),
};

export const historialService = {
  ...createCrudService<HistorialServicio>('historial'),
  getByVehiculo: (vehiculoId: number) =>
    api.get<ApiResponse<HistorialServicio[]>>(`/vehiculos/${vehiculoId}/historial`),
  getByUsuario: (usuarioId: number) =>
    api.get<ApiResponse<HistorialServicio[]>>(`/usuarios/${usuarioId}/historial`),
}; 