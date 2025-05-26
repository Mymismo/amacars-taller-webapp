import axios from '../config/axios';
import { Vehiculo } from '../types/vehiculo';

export const getVehiculosCliente = async (): Promise<Vehiculo[]> => {
  const response = await axios.get('/api/v1/vehiculos');
  return response.data;
};

export const getVehiculoById = async (id: number): Promise<Vehiculo> => {
  const response = await axios.get(`/api/v1/vehiculos/${id}`);
  return response.data;
};

export const crearVehiculo = async (data: Omit<Vehiculo, 'id' | 'created_at' | 'updated_at'>): Promise<Vehiculo> => {
  const response = await axios.post('/api/v1/vehiculos', data);
  return response.data;
};

export const actualizarVehiculo = async (id: number, data: Partial<Vehiculo>): Promise<Vehiculo> => {
  const response = await axios.put(`/api/v1/vehiculos/${id}`, data);
  return response.data;
};

export const eliminarVehiculo = async (id: number): Promise<void> => {
  await axios.delete(`/api/v1/vehiculos/${id}`);
}; 