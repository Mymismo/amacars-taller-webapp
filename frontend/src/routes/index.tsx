import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Páginas públicas
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';

// Páginas de administrador
import Dashboard from '../pages/admin/Dashboard';
import GestionUsuarios from '../pages/admin/GestionUsuarios';
import GestionServicios from '../pages/admin/GestionServicios';

// Páginas de cliente
import MisCitas from '../pages/cliente/MisCitas';
import NuevaCita from '../pages/cliente/NuevaCita';
import MiPerfil from '../pages/cliente/MiPerfil';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    return isAuthenticated && user?.rol === 'admin' ? (
        <>{children}</>
    ) : (
        <Navigate to="/unauthorized" />
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Rutas protegidas */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                
                {/* Rutas de administrador */}
                <Route
                    path="/dashboard"
                    element={
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        <AdminRoute>
                            <GestionUsuarios />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/servicios"
                    element={
                        <AdminRoute>
                            <GestionServicios />
                        </AdminRoute>
                    }
                />

                {/* Rutas de cliente */}
                <Route
                    path="/mis-citas"
                    element={
                        <PrivateRoute>
                            <MisCitas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/nueva-cita"
                    element={
                        <PrivateRoute>
                            <NuevaCita />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/mi-perfil"
                    element={
                        <PrivateRoute>
                            <MiPerfil />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
};

export default AppRoutes; 