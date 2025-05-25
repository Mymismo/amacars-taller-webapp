import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useAuth } from '../contexts/AuthContext';
import { notificacionesService } from '../api/services';
import { Notificacion } from '../types';

const NotificationsBar = () => {
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarNotificaciones = async () => {
    if (!auth.user?.id) return;
    
    setLoading(true);
    try {
      const response = await notificacionesService.getByUsuario(auth.user.id);
      if (response.data.success && response.data.data) {
        setNotificaciones(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
    // Configurar intervalo para actualizar notificaciones
    const interval = setInterval(cargarNotificaciones, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [auth.user?.id]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificacionId: number) => {
    try {
      await notificacionesService.marcarComoLeida(notificacionId);
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);

  return (
    <AppBar 
      position="static" 
      color="default" 
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar variant="dense">
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="inherit"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Badge badgeContent={notificacionesNoLeidas.length} color="error">
              <NotificationsIcon />
            </Badge>
          )}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              maxHeight: 400,
              width: '350px',
            },
          }}
        >
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography variant="subtitle1">Notificaciones</Typography>
          </MenuItem>
          <Divider />
          {notificaciones.length === 0 ? (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones
              </Typography>
            </MenuItem>
          ) : (
            <List sx={{ width: '100%', padding: 0 }}>
              {notificaciones.map((notificacion) => (
                <React.Fragment key={notificacion.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: notificacion.leida ? 'transparent' : 'action.hover',
                    }}
                  >
                    <ListItemIcon>
                      {!notificacion.leida && (
                        <IconButton
                          size="small"
                          onClick={() => notificacion.id && handleMarkAsRead(notificacion.id)}
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={notificacion.titulo}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notificacion.mensaje}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {new Date(notificacion.fecha).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NotificationsBar; 