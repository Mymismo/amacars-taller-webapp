import { axiosInstance } from './config';
import { Servicio } from '../types';

interface ServicioInput {
    nombre: string;
    descripcion: string;
    precio: number;
    duracion_estimada: number;
}

// Obtener todos los servicios
export const getServicios = async (incluirInactivos: boolean = false): Promise<Servicio[]> => {
    const response = await axiosInstance.get('/servicios', {
        params: { incluir_inactivos: incluirInactivos }
    });
    return response.data;
};

// Obtener un servicio específico
export const getServicio = async (id: number): Promise<Servicio> => {
    const response = await axiosInstance.get(`/servicios/${id}`);
    return response.data;
};

// Crear un nuevo servicio
export const crearServicio = async (servicio: ServicioInput): Promise<Servicio> => {
    const response = await axiosInstance.post('/servicios', servicio);
    return response.data;
};

// Actualizar un servicio
export const actualizarServicio = async (id: number, servicio: Partial<ServicioInput>): Promise<Servicio> => {
    const response = await axiosInstance.put(`/servicios/${id}`, servicio);
    return response.data;
};

// Activar/desactivar un servicio
export const toggleServicioActivo = async (id: number, activo: boolean): Promise<Servicio> => {
    const response = await axiosInstance.patch(`/servicios/${id}/estado`, { activo });
    return response.data;
}; 