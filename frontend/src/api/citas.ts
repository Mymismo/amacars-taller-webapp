import axios from '../config/axios';
import { Cita, CitaCreate, CitaUpdate, CitaWithRelations } from '../types/cita';

export const getCitasCliente = async (): Promise<CitaWithRelations[]> => {
  const response = await axios.get('/api/v1/citas');
  return response.data;
};

export const getCitaById = async (id: number): Promise<CitaWithRelations> => {
  const response = await axios.get(`/api/v1/citas/${id}`);
  return response.data;
};

export const crearCita = async (data: CitaCreate): Promise<Cita> => {
  const response = await axios.post('/api/v1/citas', data);
  return response.data;
};

export const actualizarCita = async (id: number, data: CitaUpdate): Promise<Cita> => {
  const response = await axios.put(`/api/v1/citas/${id}`, data);
  return response.data;
};

export const cancelarCita = async (id: number): Promise<Cita> => {
  const response = await axios.delete(`/api/v1/citas/${id}`);
  return response.data;
};

export const getCitasByFecha = async (fecha: string): Promise<CitaWithRelations[]> => {
  const response = await axios.get(`/api/v1/citas/fecha/${fecha}`);
  return response.data;
}; 