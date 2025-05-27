import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Páginas públicas
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ConfirmarEmail from '../pages/auth/ConfirmarEmail';
import TestLogin from '../pages/auth/TestLogin';
import Home from '../pages/Home';
import Unauthorized from '../pages/Unauthorized';

// Páginas de administrador
import Dashboard from '../pages/admin/Dashboard';
import GestionUsuarios from '../pages/admin/GestionUsuarios';
import GestionServicios from '../pages/admin/GestionServicios';

// Páginas de cliente
import MisCitas from '../pages/cliente/MisCitas';
import NuevaCita from '../pages/cliente/NuevaCita';
import MisVehiculos from '../pages/cliente/MisVehiculos';
import NuevoVehiculo from '../pages/cliente/NuevoVehiculo';
import EditarVehiculo from '../pages/cliente/EditarVehiculo';
import MiPerfil from '../pages/cliente/MiPerfil';

// Páginas de mecánico
import CitasAsignadas from '../pages/mecanico/CitasAsignadas';
import HistorialServicios from '../pages/mecanico/HistorialServicios';

// Páginas de recepcionista
import GestionCitas from '../pages/recepcionista/GestionCitas';
import GestionClientes from '../pages/recepcionista/GestionClientes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirmar-email/:token" element={<ConfirmarEmail />} />
                <Route path="/test-login" element={<TestLogin />} />
            </Route>

            {/* Rutas protegidas */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Rutas de administrador */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <GestionUsuarios />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/servicios"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <GestionServicios />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas de cliente */}
                <Route
                    path="/mis-citas"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE']}>
                            <MisCitas />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mi-perfil"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE', 'ADMIN', 'MECANICO', 'RECEPCIONISTA']}>
                            <MiPerfil />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/nueva-cita"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE']}>
                            <NuevaCita />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mis-vehiculos"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE']}>
                            <MisVehiculos />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mis-vehiculos/nuevo"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE']}>
                            <NuevoVehiculo />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mis-vehiculos/editar/:id"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENTE']}>
                            <EditarVehiculo />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas de mecánico */}
                <Route
                    path="/citas-asignadas"
                    element={
                        <ProtectedRoute allowedRoles={['MECANICO']}>
                            <CitasAsignadas />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/historial-servicios"
                    element={
                        <ProtectedRoute allowedRoles={['MECANICO']}>
                            <HistorialServicios />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas de recepcionista */}
                <Route
                    path="/gestion-citas"
                    element={
                        <ProtectedRoute allowedRoles={['RECEPCIONISTA']}>
                            <GestionCitas />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gestion-clientes"
                    element={
                        <ProtectedRoute allowedRoles={['RECEPCIONISTA']}>
                            <GestionClientes />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Ruta por defecto - redirige a la página principal */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes; 