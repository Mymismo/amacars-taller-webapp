import { axiosInstance } from './config';
import { Cliente, ClienteInput } from '../types/cliente';

// Obtener todos los clientes
export const getClientes = async (): Promise<Cliente[]> => {
    const response = await axiosInstance.get('/clientes');
    return response.data;
};

// Obtener un cliente específico
export const getCliente = async (id: number): Promise<Cliente> => {
    const response = await axiosInstance.get(`/clientes/${id}`);
    return response.data;
};

// Crear un nuevo cliente
export const crearCliente = async (data: Omit<Cliente, 'id'>): Promise<Cliente> => {
    const response = await axiosInstance.post('/clientes', data);
    return response.data;
};

// Actualizar un cliente
export const actualizarCliente = async (id: number, data: Partial<Cliente>): Promise<Cliente> => {
    const response = await axiosInstance.put(`/clientes/${id}`, data);
    return response.data;
};

// Eliminar un cliente
export const eliminarCliente = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/clientes/${id}`);
}; 