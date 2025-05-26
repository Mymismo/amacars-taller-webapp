import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/config';

interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  rol: string;
  activo: boolean;
}

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/api/v1/usuarios');
        if (response.status === 200) {
          setUsuarios(response.data);
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    if (user?.rol === 'ADMIN') {
      fetchUsuarios();
    }
  }, [user]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Usuarios
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mb: 3 }}
        >
          Nuevo Usuario
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre_completo}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>{usuario.activo ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary">Editar</Button>
                    <Button size="small" color="error">Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default GestionUsuarios; 