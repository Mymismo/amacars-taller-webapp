// Exportaciones individuales
export * from './types';
export * from './api';
export * from './hooks';
export * from './components/CitasList';

// Exportación agrupada
import * as citasApi from './api';
import {
    useCitas,
    useCita,
    useCreateCita,
    useUpdateCita,
    useDeleteCita,
    useCambiarEstadoCita,
    useAsignarMecanico,
    useHorariosDisponibles,
    useCitasPorMecanico,
    useCitasPorCliente
} from './hooks';
import { CitasList } from './components/CitasList';

export const Citas = {
    api: citasApi,
    hooks: {
        useCitas,
        useCita,
        useCreateCita,
        useUpdateCita,
        useDeleteCita,
        useCambiarEstadoCita,
        useAsignarMecanico,
        useHorariosDisponibles,
        useCitasPorMecanico,
        useCitasPorCliente
    },
    components: {
        CitasList
    }
}; 