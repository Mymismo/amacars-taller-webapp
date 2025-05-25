import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { type Vehiculo, vehiculosService } from '../api/services';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVehiculo, setCurrentVehiculo] = useState<Vehiculo>({
    cliente_id: 0,
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    color: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      const response = await vehiculosService.getAll();
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    }
  };

  const handleOpenDialog = (vehiculo?: Vehiculo) => {
    if (vehiculo) {
      setCurrentVehiculo(vehiculo);
      setIsEditing(true);
    } else {
      setCurrentVehiculo({
        cliente_id: 0,
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        placa: '',
        color: '',
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVehiculo(prev => ({
      ...prev,
      [name]: name === 'ano' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentVehiculo.id) {
        await vehiculosService.update(currentVehiculo.id, currentVehiculo);
      } else {
        await vehiculosService.create(currentVehiculo);
      }
      handleCloseDialog();
      loadVehiculos();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este vehículo?')) {
      try {
        await vehiculosService.delete(id);
        loadVehiculos();
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Vehículos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Vehículo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Cliente ID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id}>
                <TableCell>{vehiculo.marca}</TableCell>
                <TableCell>{vehiculo.modelo}</TableCell>
                <TableCell>{vehiculo.ano}</TableCell>
                <TableCell>{vehiculo.placa}</TableCell>
                <TableCell>{vehiculo.color}</TableCell>
                <TableCell>{vehiculo.cliente_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(vehiculo)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => vehiculo.id && handleDelete(vehiculo.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="cliente_id"
            label="ID del Cliente"
            type="number"
            fullWidth
            value={currentVehiculo.cliente_id}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="marca"
            label="Marca"
            type="text"
            fullWidth
            value={currentVehiculo.marca}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="modelo"
            label="Modelo"
            type="text"
            fullWidth
            value={currentVehiculo.modelo}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="ano"
            label="Año"
            type="number"
            fullWidth
            value={currentVehiculo.ano}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="placa"
            label="Placa"
            type="text"
            fullWidth
            value={currentVehiculo.placa}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="color"
            label="Color"
            type="text"
            fullWidth
            value={currentVehiculo.color}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Vehiculos; 