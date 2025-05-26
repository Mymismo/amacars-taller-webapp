import axios from '../config/axios';
import { Servicio } from '../types/servicio';

export const getServicios = async (): Promise<Servicio[]> => {
  const response = await axios.get('/api/v1/servicios');
  return response.data;
};

export const getServicioById = async (id: number): Promise<Servicio> => {
  const response = await axios.get(`/api/v1/servicios/${id}`);
  return response.data;
};

export const getServiciosByCategoria = async (categoria: string): Promise<Servicio[]> => {
  const response = await axios.get(`/api/v1/servicios/categoria/${categoria}`);
  return response.data;
}; 