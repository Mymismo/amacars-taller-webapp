import { axiosInstance } from './config';
import { User } from '../types';

interface LoginResponse {
    access_token: string;
    user: User;
}

interface RegisterData {
    nombre_completo: string;
    email: string;
    password: string;
    telefono?: string;
    direccion?: string;
    rol?: string;
}

// Login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        const response = await axiosInstance.post('/auth/login', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }

        return response.data;
    } catch (error: any) {
        console.error('Error en login:', error.response?.data || error.message);
        throw error;
    }
};

// Registro
export const register = async (data: RegisterData): Promise<User> => {
    try {
        const response = await axiosInstance.post('/auth/register', {
            ...data,
            rol: data.rol || 'CLIENTE' // Si no se especifica un rol, se asigna CLIENTE por defecto
        });
        return response.data;
    } catch (error: any) {
        console.error('Error en registro:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener usuario actual
export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener usuario actual:', error.response?.data || error.message);
        throw error;
    }
};

// Cambiar contraseña
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
        await axiosInstance.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        });
    } catch (error: any) {
        console.error('Error al cambiar contraseña:', error.response?.data || error.message);
        throw error;
    }
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email: string): Promise<void> => {
    try {
        await axiosInstance.post('/auth/request-password-reset', { email });
    } catch (error: any) {
        console.error('Error al solicitar reset de contraseña:', error.response?.data || error.message);
        throw error;
    }
};

// Restablecer contraseña
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
        await axiosInstance.post('/auth/reset-password', {
            token,
            new_password: newPassword
        });
    } catch (error: any) {
        console.error('Error al restablecer contraseña:', error.response?.data || error.message);
        throw error;
    }
}; 