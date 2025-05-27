import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviciosApi } from './api';
import { ServicioCreate, ServicioUpdate, ServicioFiltros } from './types';

export const useServicios = (filtros?: ServicioFiltros) => {
    return useQuery({
        queryKey: ['servicios', filtros],
        queryFn: () => serviciosApi.getServicios(filtros)
    });
};

export const useServicio = (id: number) => {
    return useQuery({
        queryKey: ['servicios', id],
        queryFn: () => serviciosApi.getServicioById(id)
    });
};

export const useCreateServicio = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (servicio: ServicioCreate) => serviciosApi.createServicio(servicio),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servicios'] });
        }
    });
};

export const useUpdateServicio = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, servicio }: { id: number; servicio: ServicioUpdate }) => 
            serviciosApi.updateServicio(id, servicio),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servicios'] });
        }
    });
};

export const useDeleteServicio = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => serviciosApi.deleteServicio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servicios'] });
        }
    });
};

export const useToggleServicioActivo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => serviciosApi.toggleServicioActivo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servicios'] });
        }
    });
}; 