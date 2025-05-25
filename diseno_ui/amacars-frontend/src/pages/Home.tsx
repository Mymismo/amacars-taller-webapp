import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import { DirectionsCar, Build, Schedule, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      title: 'Gestión de Vehículos',
      description: 'Registra y administra los vehículos de tus clientes',
      path: '/vehiculos'
    },
    {
      icon: <Schedule sx={{ fontSize: 40 }} />,
      title: 'Gestión de Citas',
      description: 'Programa y gestiona las citas del taller',
      path: '/citas'
    },
    {
      icon: <Build sx={{ fontSize: 40 }} />,
      title: 'Servicios del Taller',
      description: 'Explora nuestros servicios de mantenimiento y reparación',
      path: '/servicios'
    },
    {
      icon: <Info sx={{ fontSize: 40 }} />,
      title: 'Sobre Nosotros',
      description: 'Conoce más sobre nuestro taller y experiencia',
      path: '/about'
    }
  ];

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
          Bienvenido a AMACARS
        </Typography>
        <Typography 
          variant="h5" 
          color="textSecondary" 
          paragraph
          sx={{
            fontSize: '1.5rem'
          }}
        >
          Tu taller mecánico de confianza
        </Typography>
      </Box>

      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }} 
        justifyContent="center"
        alignItems="center"
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: 280,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                margin: '0 auto',
              }}
              elevation={2}
              onClick={() => navigate(feature.path)}
            >
              <Box 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: 60,
                  color: '#007BFF'
                }}
              >
                {feature.icon}
              </Box>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#007BFF',
                  fontWeight: 500
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2, 
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: 60,
                }}
              >
                {feature.description}
              </Typography>
              <Box sx={{ mt: 'auto', height: 40 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                  sx={{
                    borderColor: '#007BFF',
                    color: '#007BFF',
                    '&:hover': {
                      backgroundColor: '#007BFF',
                      borderColor: '#007BFF',
                      color: 'white',
                    }
                  }}
                >
                  Ver más
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 