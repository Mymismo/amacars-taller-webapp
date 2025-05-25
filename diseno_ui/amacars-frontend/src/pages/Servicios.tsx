import { Typography, Box } from '@mui/material';

export default function Servicios() {
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
          Servicios del Taller
        </Typography>
        <Typography 
          variant="h5" 
          color="textSecondary" 
          paragraph
          sx={{
            fontSize: '1.5rem'
          }}
        >
          Explora nuestros servicios de mantenimiento y reparación
        </Typography>
      </Box>
    </Box>
  );
} 