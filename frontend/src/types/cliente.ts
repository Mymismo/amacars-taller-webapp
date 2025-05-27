export interface Cliente {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClienteInput {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion?: string;
} 