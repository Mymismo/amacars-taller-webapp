import { axiosInstance } from './config';
import { Usuario, Vehiculo, Servicio, Cita, Presupuesto, GrupoClientes, Notificacion } from '../types';

// Servicios de Autenticación
export const authService = {
    login: async (email: string, password: string) => {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        try {
            const response = await axiosInstance.post('/auth/login', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            }
            
            return response.data;
        } catch (error: any) {
            console.error('Error en el login:', error.response?.data || error);
            throw error;
        }
    },
    register: async (data: { nombre_completo: string; email: string; password: string; telefono: string }) => {
        // Validar y limpiar el nombre completo
        const nombreLimpio = data.nombre_completo.trim().replace(/\s+/g, ' ');
        
        if (nombreLimpio.length < 3) {
            throw new Error('El nombre completo debe tener al menos 3 caracteres');
        }
        
        let nombre, apellidos;
        const partes = nombreLimpio.split(' ');
        
        if (partes.length === 1) {
            nombre = partes[0];
            apellidos = '';
        } else {
            nombre = partes[0];
            apellidos = partes.slice(1).join(' ');
        }
        
        const userData = {
            email: data.email,
            password: data.password,
            nombre: nombre,
            apellidos: apellidos,
            telefono: data.telefono,
            rol: 'CLIENTE' as const,
            es_activo: true,
            es_superusuario: false
        };
        
        try {
            const response = await axiosInstance.post('/auth/registro', userData);
            return response.data;
        } catch (error: any) {
            console.error('Error en el registro:', error.response?.data || error);
            throw error;
        }
    },
    getCurrentUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                delete axiosInstance.defaults.headers.common['Authorization'];
            }
            console.error('Error al obtener usuario actual:', error.response?.data || error);
            throw error;
        }
    },
};

// Servicios de Usuarios
export const usuariosService = {
    getAll: async () => {
        const response = await axiosInstance.get('/usuarios/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await axiosInstance.get(`/usuarios/${id}`);
        return response.data;
    },
    create: async (data: Partial<Usuario>) => {
        const response = await axiosInstance.post('/usuarios/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Usuario>) => {
        const response = await axiosInstance.put(`/usuarios/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/usuarios/${id}`);
        return response.data;
    },
};

// Servicios de Vehículos
export const vehiculosService = {
    getAll: async () => {
        const response = await axiosInstance.get('/vehiculos/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await axiosInstance.get(`/vehiculos/${id}`);
        return response.data;
    },
    getByPropietario: async (propietarioId: number) => {
        const response = await axiosInstance.get(`/vehiculos/propietario/${propietarioId}`);
        return response.data;
    },
    create: async (data: Partial<Vehiculo>) => {
        const response = await axiosInstance.post('/vehiculos/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Vehiculo>) => {
        const response = await axiosInstance.put(`/vehiculos/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/vehiculos/${id}`);
        return response.data;
    },
};

// Servicios de Servicios
export const serviciosService = {
    getAll: async () => {
        const response = await axiosInstance.get('/servicios/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await axiosInstance.get(`/servicios/${id}`);
        return response.data;
    },
    create: async (data: Partial<Servicio>) => {
        const response = await axiosInstance.post('/servicios/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Servicio>) => {
        const response = await axiosInstance.put(`/servicios/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/servicios/${id}`);
        return response.data;
    },
};

// Servicios de Citas
export const citasService = {
    getAll: async () => {
        const response = await axiosInstance.get('/citas/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await axiosInstance.get(`/citas/${id}`);
        return response.data;
    },
    getByCliente: async (clienteId: number) => {
        const response = await axiosInstance.get(`/citas/cliente/${clienteId}`);
        return response.data;
    },
    create: async (data: Partial<Cita>) => {
        const response = await axiosInstance.post('/citas/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Cita>) => {
        const response = await axiosInstance.put(`/citas/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/citas/${id}`);
        return response.data;
    },
};

// Servicios de Presupuestos
export const presupuestosService = {
    getAll: async () => {
        const response = await api.get('/presupuestos/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/presupuestos/${id}`);
        return response.data;
    },
    getByCita: async (citaId: number) => {
        const response = await api.get(`/presupuestos/cita/${citaId}`);
        return response.data;
    },
    create: async (data: Partial<Presupuesto>) => {
        const response = await api.post('/presupuestos/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Presupuesto>) => {
        const response = await api.put(`/presupuestos/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/presupuestos/${id}`);
        return response.data;
    },
};

// Servicios de Grupos de Clientes
export const gruposClientesService = {
    getAll: async () => {
        const response = await api.get('/grupos-clientes/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/grupos-clientes/${id}`);
        return response.data;
    },
    create: async (data: Partial<GrupoClientes>) => {
        const response = await api.post('/grupos-clientes/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<GrupoClientes>) => {
        const response = await api.put(`/grupos-clientes/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/grupos-clientes/${id}`);
        return response.data;
    },
};

// Servicios de Notificaciones
export const notificacionesService = {
    getAll: async () => {
        const response = await api.get('/notificaciones/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/notificaciones/${id}`);
        return response.data;
    },
    getByUsuario: async (usuarioId: number) => {
        const response = await api.get(`/notificaciones/usuario/${usuarioId}`);
        return response.data;
    },
    create: async (data: Partial<Notificacion>) => {
        const response = await api.post('/notificaciones/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Notificacion>) => {
        const response = await api.put(`/notificaciones/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/notificaciones/${id}`);
        return response.data;
    },
    marcarComoLeida: async (id: number) => {
        const response = await api.put(`/notificaciones/${id}/leer`);
        return response.data;
    },
}; 