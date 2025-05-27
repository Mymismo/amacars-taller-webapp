import axios from 'axios';
import { User } from '../types';

// Crear una instancia específica para autenticación
const authAxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

interface RegisterData {
    nombre_completo: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    rol?: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        // Crear FormData para enviar como x-www-form-urlencoded (requerido por OAuth2)
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        formData.append('grant_type', 'password');

        const response = await authAxiosInstance.post('/auth/login', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error en login:', error.response?.data || error.message);
        throw error;
    }
};

// Registro
export const register = async (data: RegisterData): Promise<User> => {
    try {
        // Dividir nombre_completo en nombre y apellidos
        const partes = data.nombre_completo.trim().split(' ');
        const nombre = partes[0];
        const apellidos = partes.slice(1).join(' ');
        
        const payload = {
            nombre,
            apellidos,
            email: data.email,
            password: data.password,
            telefono: data.telefono,
            direccion: data.direccion,
            rol: data.rol || 'CLIENTE'
        };

        const response = await authAxiosInstance.post('/auth/registro', payload);
        return response.data;
    } catch (error: any) {
        console.error('Error en registro:', error.response?.data || error.message);
        throw error;
    }
};

// Confirmar email
export const confirmarEmail = async (token: string): Promise<void> => {
    try {
        await authAxiosInstance.post(`/auth/confirmar-email/${token}`);
    } catch (error: any) {
        console.error('Error al confirmar email:', error.response?.data || error.message);
        throw error;
    }
};

// Reenviar email de confirmación
export const reenviarConfirmacion = async (email: string): Promise<void> => {
    try {
        await authAxiosInstance.post('/auth/reenviar-confirmacion', { email });
    } catch (error: any) {
        console.error('Error al reenviar confirmación:', error.response?.data || error.message);
        throw error;
    }
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
    try {
        await authAxiosInstance.post('/auth/logout');
    } catch (error: any) {
        console.error('Error en logout:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener usuario actual
export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await authAxiosInstance.get('/auth/me', {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener usuario actual:', error.response?.data || error.message);
        throw error;
    }
};

// Cambiar contraseña
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
        await authAxiosInstance.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        }, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
    } catch (error: any) {
        console.error('Error al cambiar contraseña:', error.response?.data || error.message);
        throw error;
    }
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email: string): Promise<void> => {
    try {
        await authAxiosInstance.post('/auth/request-password-reset', { email });
    } catch (error: any) {
        console.error('Error al solicitar reset de contraseña:', error.response?.data || error.message);
        throw error;
    }
};

// Restablecer contraseña
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
        await authAxiosInstance.post('/auth/reset-password', {
            token,
            new_password: newPassword
        });
    } catch (error: any) {
        console.error('Error al restablecer contraseña:', error.response?.data || error.message);
        throw error;
    }
}; 