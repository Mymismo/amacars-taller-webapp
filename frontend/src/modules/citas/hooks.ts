import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citasApi } from './api';
import { CitaCreate, CitaUpdate, CitaFiltros } from './types';

export const useCitas = (filtros?: CitaFiltros) => {
    return useQuery({
        queryKey: ['citas', filtros],
        queryFn: () => citasApi.getCitas(filtros)
    });
};

export const useCita = (id: number) => {
    return useQuery({
        queryKey: ['citas', id],
        queryFn: () => citasApi.getCitaById(id),
        enabled: !!id
    });
};

export const useCreateCita = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (cita: CitaCreate) => citasApi.createCita(cita),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citas'] });
        }
    });
};

export const useUpdateCita = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, cita }: { id: number; cita: CitaUpdate }) => 
            citasApi.updateCita(id, cita),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citas'] });
        }
    });
};

export const useDeleteCita = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => citasApi.deleteCita(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citas'] });
        }
    });
};

export const useCambiarEstadoCita = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: string }) => 
            citasApi.cambiarEstado(id, estado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citas'] });
        }
    });
};

export const useAsignarMecanico = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, mecanico_id }: { id: number; mecanico_id: number }) => 
            citasApi.asignarMecanico(id, mecanico_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citas'] });
        }
    });
};

export const useHorariosDisponibles = (fecha: string, servicio_id: number) => {
    return useQuery({
        queryKey: ['horarios', fecha, servicio_id],
        queryFn: () => citasApi.getHorariosDisponibles(fecha, servicio_id),
        enabled: !!fecha && !!servicio_id
    });
};

export const useCitasPorMecanico = (mecanico_id: number, fecha?: string) => {
    return useQuery({
        queryKey: ['citas', 'mecanico', mecanico_id, fecha],
        queryFn: () => citasApi.getCitasPorMecanico(mecanico_id, fecha),
        enabled: !!mecanico_id
    });
};

export const useCitasPorCliente = (cliente_id: number) => {
    return useQuery({
        queryKey: ['citas', 'cliente', cliente_id],
        queryFn: () => citasApi.getCitasPorCliente(cliente_id),
        enabled: !!cliente_id
    });
}; 