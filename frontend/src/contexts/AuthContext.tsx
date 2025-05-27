import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/config';
import { User } from '../types';
import { getInitialRoute } from '../utils/routeUtils';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Función para normalizar roles
const normalizeRole = (role: string): string => {
    return role.toUpperCase();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await axiosInstance.post('/auth/login', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, user: userData } = response.data;
            localStorage.setItem('token', access_token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            // Normalizar el rol antes de guardar el usuario
            userData.rol = normalizeRole(userData.rol);
            setUser(userData);

            // Redirigir al usuario a su ruta inicial
            navigate(getInitialRoute(userData.rol));
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axiosInstance.get('/auth/me');
                    const userData = response.data;
                    // Normalizar el rol antes de guardar el usuario
                    userData.rol = normalizeRole(userData.rol);
                    setUser(userData);
                    
                    // Redirigir al usuario a su ruta inicial si está en la raíz
                    if (window.location.pathname === '/') {
                        navigate(getInitialRoute(userData.rol));
                    }
                }
            } catch (error) {
                console.error('Error al inicializar autenticación:', error);
                localStorage.removeItem('token');
                delete axiosInstance.defaults.headers.common['Authorization'];
                setUser(null);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, [navigate]);

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 