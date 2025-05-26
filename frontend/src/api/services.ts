import { apiClient } from './client';
import { Usuario, Vehiculo, Servicio, Cita, Presupuesto, GrupoClientes, Notificacion } from '../types';

// Servicios de Autenticación
export const authService = {
    login: async (email: string, password: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const response = await apiClient.post('/auth/login', formData);
        return response.data;
    },
    register: async (data: Partial<Usuario>) => {
        const userData = {
            ...data,
            rol: data.rol || 'CLIENTE',
            apellidos: data.apellidos || '',
            direccion: data.direccion || ''
        };
        const response = await apiClient.post('/auth/registro', userData);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
};

// Servicios de Usuarios
export const usuariosService = {
    getAll: async () => {
        const response = await apiClient.get('/usuarios/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/usuarios/${id}`);
        return response.data;
    },
    create: async (data: Partial<Usuario>) => {
        const response = await apiClient.post('/usuarios/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Usuario>) => {
        const response = await apiClient.put(`/usuarios/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/usuarios/${id}`);
        return response.data;
    },
};

// Servicios de Vehículos
export const vehiculosService = {
    getAll: async () => {
        const response = await apiClient.get('/vehiculos/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/vehiculos/${id}`);
        return response.data;
    },
    getByPropietario: async (propietarioId: number) => {
        const response = await apiClient.get(`/vehiculos/propietario/${propietarioId}`);
        return response.data;
    },
    create: async (data: Partial<Vehiculo>) => {
        const response = await apiClient.post('/vehiculos/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Vehiculo>) => {
        const response = await apiClient.put(`/vehiculos/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/vehiculos/${id}`);
        return response.data;
    },
};

// Servicios de Servicios
export const serviciosService = {
    getAll: async () => {
        const response = await apiClient.get('/servicios/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/servicios/${id}`);
        return response.data;
    },
    create: async (data: Partial<Servicio>) => {
        const response = await apiClient.post('/servicios/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Servicio>) => {
        const response = await apiClient.put(`/servicios/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/servicios/${id}`);
        return response.data;
    },
};

// Servicios de Citas
export const citasService = {
    getAll: async () => {
        const response = await apiClient.get('/citas/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/citas/${id}`);
        return response.data;
    },
    getByCliente: async (clienteId: number) => {
        const response = await apiClient.get(`/citas/cliente/${clienteId}`);
        return response.data;
    },
    create: async (data: Partial<Cita>) => {
        const response = await apiClient.post('/citas/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Cita>) => {
        const response = await apiClient.put(`/citas/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/citas/${id}`);
        return response.data;
    },
};

// Servicios de Presupuestos
export const presupuestosService = {
    getAll: async () => {
        const response = await apiClient.get('/presupuestos/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/presupuestos/${id}`);
        return response.data;
    },
    getByCita: async (citaId: number) => {
        const response = await apiClient.get(`/presupuestos/cita/${citaId}`);
        return response.data;
    },
    create: async (data: Partial<Presupuesto>) => {
        const response = await apiClient.post('/presupuestos/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Presupuesto>) => {
        const response = await apiClient.put(`/presupuestos/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/presupuestos/${id}`);
        return response.data;
    },
};

// Servicios de Grupos de Clientes
export const gruposClientesService = {
    getAll: async () => {
        const response = await apiClient.get('/grupos-clientes/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/grupos-clientes/${id}`);
        return response.data;
    },
    create: async (data: Partial<GrupoClientes>) => {
        const response = await apiClient.post('/grupos-clientes/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<GrupoClientes>) => {
        const response = await apiClient.put(`/grupos-clientes/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/grupos-clientes/${id}`);
        return response.data;
    },
};

// Servicios de Notificaciones
export const notificacionesService = {
    getAll: async () => {
        const response = await apiClient.get('/notificaciones/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/notificaciones/${id}`);
        return response.data;
    },
    getByUsuario: async (usuarioId: number) => {
        const response = await apiClient.get(`/notificaciones/usuario/${usuarioId}`);
        return response.data;
    },
    create: async (data: Partial<Notificacion>) => {
        const response = await apiClient.post('/notificaciones/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Notificacion>) => {
        const response = await apiClient.put(`/notificaciones/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/notificaciones/${id}`);
        return response.data;
    },
    marcarComoLeida: async (id: number) => {
        const response = await apiClient.put(`/notificaciones/${id}/leer`);
        return response.data;
    },
}; 