import { axiosInstance } from '../../api/axiosInstance';
import { Servicio, ServicioCreate, ServicioUpdate, ServicioFiltros } from './types';

export const serviciosApi = {
    getServicios: async (filtros?: ServicioFiltros): Promise<Servicio[]> => {
        const response = await axiosInstance.get('/servicios', { params: filtros });
        return response.data;
    },

    getServicioById: async (id: number): Promise<Servicio> => {
        const response = await axiosInstance.get(`/servicios/${id}`);
        return response.data;
    },

    createServicio: async (servicio: ServicioCreate): Promise<Servicio> => {
        const response = await axiosInstance.post('/servicios', servicio);
        return response.data;
    },

    updateServicio: async (id: number, servicio: ServicioUpdate): Promise<Servicio> => {
        const response = await axiosInstance.put(`/servicios/${id}`, servicio);
        return response.data;
    },

    deleteServicio: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/servicios/${id}`);
    },

    toggleServicioActivo: async (id: number): Promise<Servicio> => {
        const response = await axiosInstance.patch(`/servicios/${id}/toggle-activo`);
        return response.data;
    }
}; 