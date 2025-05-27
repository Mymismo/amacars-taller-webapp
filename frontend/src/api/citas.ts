import { axiosInstance } from './axiosInstance';
import { Cita, EstadoCita } from '../types';

interface CitaInput {
    fecha: string;
    hora: string;
    vehiculo_id: number;
    servicio_id: number;
    notas?: string;
}

// Obtener todas las citas (para recepcionista)
export const getAllCitas = async (filtros?: {
    fecha?: string;
    estado?: EstadoCita;
}): Promise<Cita[]> => {
    const response = await axiosInstance.get('/citas', { params: filtros });
    return response.data;
};

// Asignar mecánico a una cita
export const asignarMecanico = async (citaId: number, mecanicoId: number): Promise<Cita> => {
    const response = await axiosInstance.patch(`/citas/${citaId}/mecanico`, {
        mecanico_id: mecanicoId
    });
    return response.data;
};

// Obtener citas del cliente actual
export const getCitasCliente = async (): Promise<Cita[]> => {
    try {
        const response = await axiosInstance.get('/citas');
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener citas:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Error al cargar las citas');
    }
};

// Obtener citas asignadas al mecánico
export const getCitasAsignadas = async (): Promise<Cita[]> => {
    const response = await axiosInstance.get('/citas/tecnico/asignadas');
    return response.data;
};

// Obtener historial de servicios del mecánico
export const getHistorialServicios = async (filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
}): Promise<Cita[]> => {
    const response = await axiosInstance.get('/citas/historial', { params: filtros });
    return response.data;
};

// Obtener una cita específica
export const getCita = async (id: number): Promise<Cita> => {
    const response = await axiosInstance.get(`/citas/${id}`);
    return response.data;
};

// Crear una nueva cita
export const crearCita = async (data: CitaInput): Promise<Cita> => {
    const response = await axiosInstance.post('/citas', data);
    return response.data;
};

// Actualizar el estado de una cita
export const actualizarEstadoCita = async (citaId: number, estado: EstadoCita, notas?: string): Promise<Cita> => {
    const response = await axiosInstance.patch(`/citas/${citaId}/estado`, {
        estado,
        notas
    });
    return response.data;
};

// Actualizar una cita
export const actualizarCita = async (id: number, data: Partial<CitaInput>): Promise<Cita> => {
    const response = await axiosInstance.put(`/citas/${id}`, data);
    return response.data;
};

// Cancelar una cita
export const cancelarCita = async (citaId: number): Promise<void> => {
    try {
        await axiosInstance.post(`/citas/${citaId}/cancelar`);
    } catch (error: any) {
        console.error('Error al cancelar cita:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Error al cancelar la cita');
    }
}; 