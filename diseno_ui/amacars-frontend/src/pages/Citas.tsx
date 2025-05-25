import { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Cita, Vehiculo } from '../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [formData, setFormData] = useState<Partial<Cita>>({
    fecha: new Date(),
    hora: '09:00',
    tipo: 'mantenimiento',
    estado: 'pendiente'
  });

  // Simulamos algunos vehículos para el ejemplo
  const [vehiculos] = useState<Vehiculo[]>([
    {
      id: '1',
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Corolla',
      año: 2020,
      color: 'Blanco',
      propietario: 'Juan Pérez',
      telefono: '123456789',
      email: 'juan@email.com'
    },
    // Añade más vehículos de ejemplo si lo deseas
  ]);

  const handleOpenDialog = (cita?: Cita) => {
    if (cita) {
      setEditingCita(cita);
      setFormData(cita);
    } else {
      setEditingCita(null);
      setFormData({
        fecha: new Date(),
        hora: '09:00',
        tipo: 'mantenimiento',
        estado: 'pendiente'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCita(null);
    setFormData({
      fecha: new Date(),
      hora: '09:00',
      tipo: 'mantenimiento',
      estado: 'pendiente'
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingCita) {
      setCitas(prev =>
        prev.map(c => (c.id === editingCita.id ? { ...c, ...formData } as Cita : c))
      );
    } else {
      const newCita: Cita = {
        id: Date.now().toString(),
        ...formData,
        fecha: formData.fecha || new Date(),
        vehiculo: vehiculos.find(v => v.id === formData.vehiculo) || vehiculos[0]
      } as Cita;
      setCitas(prev => [...prev, newCita]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setCitas(prev => prev.filter(c => c.id !== id));
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'confirmada': return 'info';
      case 'completada': return 'success';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#007BFF',
            fontSize: '3.5rem',
            fontWeight: 600
          }}
        >
          Gestión de Citas
        </Typography>
        <Typography 
          variant="h5" 
          color="textSecondary" 
          paragraph
          sx={{
            fontSize: '1.5rem'
          }}
        >
          Programa y gestiona las citas del taller
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          Nueva Cita
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>{new Date(cita.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{cita.hora}</TableCell>
                  <TableCell>{`${cita.vehiculo.marca} ${cita.vehiculo.modelo} (${cita.vehiculo.placa})`}</TableCell>
                  <TableCell>{cita.vehiculo.propietario}</TableCell>
                  <TableCell>{cita.tipo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cita.estado} 
                      color={getEstadoColor(cita.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenDialog(cita)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(cita.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCita ? 'Editar Cita' : 'Nueva Cita'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha"
                  value={formData.fecha}
                  onChange={(newValue) => handleInputChange('fecha', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <TimePicker
                  label="Hora"
                  value={new Date().setHours(parseInt(formData.hora?.split(':')[0] || '9'), parseInt(formData.hora?.split(':')[1] || '0'))}
                  onChange={(newValue) => {
                    const hours = new Date(newValue || '').getHours().toString().padStart(2, '0');
                    const minutes = new Date(newValue || '').getMinutes().toString().padStart(2, '0');
                    handleInputChange('hora', `${hours}:${minutes}`);
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vehículo</InputLabel>
                <Select
                  value={formData.vehiculo?.id || ''}
                  label="Vehículo"
                  onChange={(e) => handleInputChange('vehiculo', vehiculos.find(v => v.id === e.target.value))}
                >
                  {vehiculos.map((vehiculo) => (
                    <MenuItem key={vehiculo.id} value={vehiculo.id}>
                      {`${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa}) - ${vehiculo.propietario}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Servicio</InputLabel>
                <Select
                  value={formData.tipo || 'mantenimiento'}
                  label="Tipo de Servicio"
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                >
                  <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                  <MenuItem value="reparacion">Reparación</MenuItem>
                  <MenuItem value="revision">Revisión</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado || 'pendiente'}
                  label="Estado"
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                multiline
                rows={4}
                fullWidth
                value={formData.descripcion || ''}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCita ? 'Guardar Cambios' : 'Crear Cita'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 