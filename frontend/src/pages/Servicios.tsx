import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import BuildIcon from '@mui/icons-material/Build';
import TimerIcon from '@mui/icons-material/Timer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { type Servicio, serviciosService } from '../api/services';

const Servicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentServicio, setCurrentServicio] = useState<Servicio>({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion_estimada: 0,
    estado: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const response = await serviciosService.getAll();
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleOpenDialog = (servicio?: Servicio) => {
    if (servicio) {
      setCurrentServicio(servicio);
      setIsEditing(true);
    } else {
      setCurrentServicio({
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion_estimada: 0,
        estado: true,
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
    setCurrentServicio(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'duracion_estimada' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentServicio.id) {
        await serviciosService.update(currentServicio.id, currentServicio);
      } else {
        await serviciosService.create(currentServicio);
      }
      handleCloseDialog();
      loadServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este servicio?')) {
      try {
        await serviciosService.delete(id);
        loadServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Servicios del Taller
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Servicio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {servicios.map((servicio) => (
          <Grid item xs={12} md={4} key={servicio.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
                    {servicio.nombre}
                  </Typography>
                </Box>
                <Typography color="text.secondary" paragraph>
                  {servicio.descripcion}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {servicio.duracion_estimada} min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {servicio.precio.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={servicio.estado ? 'Activo' : 'Inactivo'} 
                    color={servicio.estado ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(servicio)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => servicio.id && handleDelete(servicio.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="nombre"
            label="Nombre del Servicio"
            type="text"
            fullWidth
            value={currentServicio.nombre}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentServicio.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="precio"
            label="Precio"
            type="number"
            fullWidth
            value={currentServicio.precio}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duracion_estimada"
            label="Duración Estimada (minutos)"
            type="number"
            fullWidth
            value={currentServicio.duracion_estimada}
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

export default Servicios; 