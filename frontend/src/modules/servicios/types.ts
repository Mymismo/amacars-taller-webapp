export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion_estimada: number;
    activo: boolean;
}

export interface ServicioCreate {
    nombre: string;
    descripcion: string;
    precio: number;
    duracion_estimada: number;
}

export interface ServicioUpdate extends Partial<ServicioCreate> {
    activo?: boolean;
}

export interface ServicioFiltros {
    activo?: boolean;
    busqueda?: string;
    ordenar_por?: 'nombre' | 'precio' | 'duracion';
    orden?: 'asc' | 'desc';
}

export interface ServiciosState {
    servicios: Servicio[];
    isLoading: boolean;
    error: string | null;
    filtros: ServicioFiltros;
} 