export * from './types';
export * from './api';
export * from './hooks';

// Exportación agrupada para facilitar el uso
export const Servicios = {
    api: require('./api').serviciosApi,
    hooks: {
        useServicios: require('./hooks').useServicios,
        useServicio: require('./hooks').useServicio,
        useCreateServicio: require('./hooks').useCreateServicio,
        useUpdateServicio: require('./hooks').useUpdateServicio,
        useDeleteServicio: require('./hooks').useDeleteServicio,
        useToggleServicioActivo: require('./hooks').useToggleServicioActivo,
    }
}; 