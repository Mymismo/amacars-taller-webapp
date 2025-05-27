import { axiosInstance } from './config';
import { User, UserUpdate } from '../types';

// Obtener todos los usuarios (solo admin)
export const getUsuarios = async (): Promise<User[]> => {
    const response = await axiosInstance.get('/usuarios');
    return response.data;
};

// Obtener un usuario específico
export const getUsuario = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/usuarios/${id}`);
    return response.data;
};

// Verificar si existe un usuario por email
export const verificarUsuario = async (email: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(`/usuarios/verificar/${email}`);
        return response.data.existe;
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return false;
    }
};

// Actualizar información del usuario
export const actualizarUsuario = async (id: string, data: UserUpdate): Promise<User> => {
    const response = await axiosInstance.put(`/usuarios/${id}`, data);
    return response.data;
};

// Eliminar usuario (solo admin)
export const eliminarUsuario = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/usuarios/${id}`);
};

// Obtener los vehículos del cliente actual
export const getVehiculosCliente = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/vehiculos/mis-vehiculos');
    return response.data;
};

// Obtener las citas del cliente actual
export const getCitasCliente = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/citas/mis-citas');
    return response.data;
};

// Cambiar contraseña
export const cambiarContraseña = async (data: { 
    contraseña_actual: string; 
    nueva_contraseña: string; 
}): Promise<void> => {
    await axiosInstance.post('/usuarios/cambiar-contraseña', data);
};

// Obtener el usuario actual
export const getCurrentUser = async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
}; 