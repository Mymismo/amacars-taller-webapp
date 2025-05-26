import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Presupuestos: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Presupuestos
      </Typography>
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Próximamente: Sistema de gestión de presupuestos
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Presupuestos; 