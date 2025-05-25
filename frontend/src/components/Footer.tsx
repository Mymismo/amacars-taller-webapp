import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AMACARS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu taller de confianza para el mantenimiento y reparación de vehículos.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Box>
              <Link component={RouterLink} to="/servicios" color="inherit">
                Servicios
              </Link>
            </Box>
            <Box>
              <Link component={RouterLink} to="/consejos" color="inherit">
                Consejos
              </Link>
            </Box>
            <Box>
              <Link component={RouterLink} to="/novedades" color="inherit">
                Novedades
              </Link>
            </Box>
            <Box>
              <Link component={RouterLink} to="/sobre-nosotros" color="inherit">
                Sobre Nosotros
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dirección: Calle Principal #123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: (123) 456-7890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contacto@amacars.com
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" component={RouterLink} to="/">
              AMACARS
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 