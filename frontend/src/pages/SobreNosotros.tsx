import { Container, Typography, Grid, Card, CardContent, Box, Avatar } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import GroupsIcon from '@mui/icons-material/Groups';

const equipo = [
  {
    nombre: 'Juan Pérez',
    cargo: 'Mecánico Principal',
    descripcion: 'Especialista en diagnóstico electrónico con más de 15 años de experiencia.',
    avatar: 'https://via.placeholder.com/150',
  },
  {
    nombre: 'María García',
    cargo: 'Jefa de Taller',
    descripcion: 'Experta en gestión de servicios automotrices y atención al cliente.',
    avatar: 'https://via.placeholder.com/150',
  },
  {
    nombre: 'Carlos Rodríguez',
    cargo: 'Técnico Especialista',
    descripcion: 'Especializado en sistemas de inyección y mantenimiento preventivo.',
    avatar: 'https://via.placeholder.com/150',
  },
];

const caracteristicas = [
  {
    titulo: 'Experiencia',
    descripcion: 'Más de 20 años brindando servicios de calidad.',
    icono: <BuildIcon fontSize="large" color="primary" />,
  },
  {
    titulo: 'Puntualidad',
    descripcion: 'Respetamos tu tiempo, entregamos cuando prometemos.',
    icono: <AccessTimeIcon fontSize="large" color="primary" />,
  },
  {
    titulo: 'Calidad',
    descripcion: 'Utilizamos repuestos originales y herramientas de última generación.',
    icono: <ThumbUpIcon fontSize="large" color="primary" />,
  },
];

const SobreNosotros = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <GroupsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Sobre AMACARS
        </Typography>
        <Typography variant="body1" paragraph>
          Somos un taller mecánico comprometido con la excelencia y la satisfacción del cliente.
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        {caracteristicas.map((caracteristica, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              textAlign: 'center',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}>
              <CardContent>
                <Box mb={2}>
                  {caracteristica.icono}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {caracteristica.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {caracteristica.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Nuestro Equipo
      </Typography>
      <Grid container spacing={4}>
        {equipo.map((miembro, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              textAlign: 'center',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}>
              <CardContent>
                <Avatar
                  src={miembro.avatar}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    margin: '0 auto 16px',
                    border: '4px solid',
                    borderColor: 'primary.main'
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  {miembro.nombre}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {miembro.cargo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {miembro.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SobreNosotros; 