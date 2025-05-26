import axios from '../config/axios';
import { Usuario } from '../types/usuario';

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axios.get('/api/v1/usuarios');
  return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await axios.get(`/api/v1/usuarios/${id}`);
  return response.data;
};

export const actualizarUsuario = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
  const response = await axios.put(`/api/v1/usuarios/${id}`, data);
  return response.data;
};

export const cambiarContraseña = async (data: { 
  contraseña_actual: string; 
  nueva_contraseña: string; 
}): Promise<void> => {
  await axios.post('/api/v1/usuarios/cambiar-contraseña', data);
}; 