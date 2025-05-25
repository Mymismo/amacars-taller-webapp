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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { type Cita, citasService } from '../api/services';

const estadosCita = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const Citas = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCita, setCurrentCita] = useState<Cita>({
    cliente_id: 0,
    vehiculo_id: 0,
    fecha_hora: new Date().toISOString().slice(0, 16),
    estado: 'pendiente',
    notas: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      const response = await citasService.getAll();
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  const handleOpenDialog = (cita?: Cita) => {
    if (cita) {
      setCurrentCita({
        ...cita,
        fecha_hora: cita.fecha_hora.slice(0, 16),
      });
      setIsEditing(true);
    } else {
      setCurrentCita({
        cliente_id: 0,
        vehiculo_id: 0,
        fecha_hora: new Date().toISOString().slice(0, 16),
        estado: 'pendiente',
        notas: '',
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
    setCurrentCita(prev => ({
      ...prev,
      [name]: name === 'cliente_id' || name === 'vehiculo_id' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentCita.id) {
        await citasService.update(currentCita.id, currentCita);
      } else {
        await citasService.create(currentCita);
      }
      handleCloseDialog();
      loadCitas();
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      try {
        await citasService.delete(id);
        loadCitas();
      } catch (error) {
        console.error('Error al eliminar cita:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Citas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Cita
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente ID</TableCell>
              <TableCell>Vehículo ID</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citas.map((cita) => (
              <TableRow key={cita.id}>
                <TableCell>{cita.cliente_id}</TableCell>
                <TableCell>{cita.vehiculo_id}</TableCell>
                <TableCell>{new Date(cita.fecha_hora).toLocaleString()}</TableCell>
                <TableCell>{cita.estado}</TableCell>
                <TableCell>{cita.notas}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(cita)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => cita.id && handleDelete(cita.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="cliente_id"
            label="ID del Cliente"
            type="number"
            fullWidth
            value={currentCita.cliente_id}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="vehiculo_id"
            label="ID del Vehículo"
            type="number"
            fullWidth
            value={currentCita.vehiculo_id}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="fecha_hora"
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            value={currentCita.fecha_hora}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="estado"
              value={currentCita.estado}
              label="Estado"
              onChange={(e) => handleInputChange(e as any)}
            >
              {estadosCita.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>
                  {estado.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="notas"
            label="Notas"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentCita.notas}
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

export default Citas; 