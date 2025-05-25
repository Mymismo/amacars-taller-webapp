import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const Home = () => {
  const services = [
    {
      title: 'Gestión de Clientes',
      description: 'Administra la información de tus clientes',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#007BFF' }} />,
      link: '/clientes'
    },
    {
      title: 'Gestión de Vehículos',
      description: 'Registra y administra los vehículos de tus clientes',
      icon: <DirectionsCarIcon sx={{ fontSize: 40, color: '#007BFF' }} />,
      link: '/vehiculos'
    },
    {
      title: 'Gestión de Citas',
      description: 'Programa y gestiona las citas del taller',
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#007BFF' }} />,
      link: '/citas'
    },
    {
      title: 'Servicios del Taller',
      description: 'Explora nuestros servicios de mantenimiento y reparación',
      icon: <BuildIcon sx={{ fontSize: 40, color: '#007BFF' }} />,
      link: '/servicios'
    }
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AMACARS - Gestión de Taller
      </Typography>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" color="primary" gutterBottom>
          Bienvenido a AMACARS
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Tu taller mecánico de confianza
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2" color="primary">
                  {service.title}
                </Typography>
                <Typography color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  component={Link} 
                  to={service.link}
                  variant="outlined" 
                  color="primary"
                >
                  VER MÁS
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card 
            sx={{ 
              textAlign: 'center',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <InfoIcon sx={{ fontSize: 40, color: '#007BFF' }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" color="primary">
                Sobre Nosotros
              </Typography>
              <Typography color="text.secondary">
                Conoce más sobre nuestro taller y experiencia
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                component={Link} 
                to="/sobre-nosotros"
                variant="outlined" 
                color="primary"
              >
                VER MÁS
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 