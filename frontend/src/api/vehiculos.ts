import { axiosInstance } from './axiosInstance';
import { Vehiculo } from '../types';

export interface VehiculoInput {
    marca: string;
    modelo: string;
    anio: string;
    matricula: string;
    kilometraje: string;
    color: string;
    tipo: string;
    cliente_id: number;
}

// Obtener todos los vehículos del cliente actual
export const getVehiculosCliente = async (): Promise<Vehiculo[]> => {
    const response = await axiosInstance.get('/vehiculos/mis-vehiculos');
    return response.data;
};

// Obtener un vehículo específico
export const getVehiculo = async (id: number): Promise<Vehiculo> => {
    const response = await axiosInstance.get(`/vehiculos/${id}`);
    return response.data;
};

// Registrar un nuevo vehículo
export const registrarVehiculo = async (vehiculo: VehiculoInput): Promise<Vehiculo> => {
    const response = await axiosInstance.post('/vehiculos', vehiculo);
    return response.data;
};

// Actualizar un vehículo
export const actualizarVehiculo = async (id: number, vehiculo: Partial<VehiculoInput>): Promise<Vehiculo> => {
    const response = await axiosInstance.put(`/vehiculos/${id}`, vehiculo);
    return response.data;
};

// Eliminar un vehículo
export const eliminarVehiculo = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/vehiculos/${id}`);
}; 