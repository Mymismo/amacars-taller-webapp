import { axiosInstance } from '../../api/axiosInstance';
import { Cita, CitaCreate, CitaUpdate, CitaFiltros } from './types';

export const citasApi = {
    getCitas: async (filtros?: CitaFiltros): Promise<Cita[]> => {
        const response = await axiosInstance.get('/api/v1/citas', { params: filtros });
        return response.data;
    },

    getCitaById: async (id: number): Promise<Cita> => {
        const response = await axiosInstance.get(`/api/v1/citas/${id}`);
        return response.data;
    },

    createCita: async (cita: CitaCreate): Promise<Cita> => {
        const response = await axiosInstance.post('/api/v1/citas', cita);
        return response.data;
    },

    updateCita: async (id: number, cita: CitaUpdate): Promise<Cita> => {
        const response = await axiosInstance.put(`/api/v1/citas/${id}`, cita);
        return response.data;
    },

    deleteCita: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/api/v1/citas/${id}`);
    },

    cambiarEstado: async (id: number, estado: string): Promise<Cita> => {
        const response = await axiosInstance.put(`/api/v1/citas/${id}`, { estado });
        return response.data;
    },

    asignarTecnico: async (id: number, tecnico_asignado_id: number): Promise<Cita> => {
        const response = await axiosInstance.put(`/api/v1/citas/${id}`, { tecnico_asignado_id });
        return response.data;
    },

    getCitasPorFecha: async (fecha: string): Promise<Cita[]> => {
        const response = await axiosInstance.get(`/api/v1/citas/fecha/${fecha}`);
        return response.data;
    },

    getCitasPorTecnico: async (tecnico_id: number): Promise<Cita[]> => {
        const response = await axiosInstance.get('/api/v1/citas/tecnico/asignadas');
        return response.data;
    }
}; 