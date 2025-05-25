import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, Usuario } from '../types';
import { authService } from '../api/services';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<Usuario>) => Promise<void>;
  updateProfile: (data: Partial<Usuario>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshToken();
    }
  }, []);

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.data.success && response.data.data) {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        // Aquí deberíamos también obtener la información actualizada del usuario
      }
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      handleLogout();
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setAuth({
          isAuthenticated: true,
          user,
          token,
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      setAuth(initialState);
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: Partial<Usuario>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.data.success && response.data.data) {
        // Opcionalmente, podríamos iniciar sesión automáticamente después del registro
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al registrar usuario');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<Usuario>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (auth.user?.id) {
        const response = await authService.updateProfile(auth.user.id, data);
        if (response.data.success && response.data.data) {
          setAuth(prev => ({
            ...prev,
            user: { ...prev.user, ...data } as Usuario,
          }));
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar perfil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    auth,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateProfile: handleUpdateProfile,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 