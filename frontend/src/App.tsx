import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Componentes de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';

// Componentes protegidos
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

// Componentes de gestión
import Vehiculos from './pages/Vehiculos';
import Citas from './pages/Citas';
import Servicios from './pages/Servicios';
import Consejos from './pages/Consejos';
import Novedades from './pages/Novedades';
import SobreNosotros from './pages/SobreNosotros';

// Componentes de administración
import AdminDashboard from './pages/admin/Dashboard';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionServicios from './pages/admin/GestionServicios';
import GestionCitas from './pages/admin/GestionCitas';
import Notificaciones from './pages/admin/Notificaciones';
import Presupuestos from './pages/admin/Presupuestos';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/servicios" replace />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="consejos" element={<Consejos />} />
              <Route path="novedades" element={<Novedades />} />
              <Route path="sobre-nosotros" element={<SobreNosotros />} />
            </Route>

            {/* Rutas de autenticación */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* Rutas protegidas para clientes */}
            <Route
              path="/cliente"
              element={
                <ProtectedRoute requiredRoles={['cliente']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="vehiculos" element={<Vehiculos />} />
              <Route path="citas" element={<Citas />} />
            </Route>

            {/* Rutas protegidas para administradores */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="servicios" element={<GestionServicios />} />
              <Route path="citas" element={<GestionCitas />} />
              <Route path="notificaciones" element={<Notificaciones />} />
              <Route path="presupuestos" element={<Presupuestos />} />
            </Route>

            {/* Ruta de acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
