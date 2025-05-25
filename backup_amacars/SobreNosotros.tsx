import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import HandshakeIcon from '@mui/icons-material/Handshake';

const SobreNosotros = () => {
  const valores = [
    {
      titulo: 'Excelencia',
      descripcion: 'Compromiso con la calidad en cada servicio que realizamos',
      icono: <StarIcon sx={{ fontSize: 40, color: '#007BFF' }} />
    },
    {
      titulo: 'Confianza',
      descripcion: 'Transparencia y honestidad en todo lo que hacemos',
      icono: <HandshakeIcon sx={{ fontSize: 40, color: '#007BFF' }} />
    },
    {
      titulo: 'Profesionalismo',
      descripcion: 'Personal altamente capacitado y en constante actualización',
      icono: <GroupsIcon sx={{ fontSize: 40, color: '#007BFF' }} />
    }
  ];

  const equipo = [
    {
      nombre: 'Carlos Rodríguez',
      cargo: 'Jefe de Taller',
      experiencia: '15 años de experiencia',
      especialidad: 'Diagnóstico electrónico'
    },
    {
      nombre: 'Ana Martínez',
      cargo: 'Técnico Senior',
      experiencia: '10 años de experiencia',
      especialidad: 'Sistemas de motor'
    },
    {
      nombre: 'Roberto Sánchez',
      cargo: 'Especialista en Alineación',
      experiencia: '8 años de experiencia',
      especialidad: 'Alineación y balanceo'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Sección de Historia */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom>
          Sobre Nosotros
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Tu taller mecánico de confianza desde 2010
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Historia */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <BuildIcon sx={{ fontSize: 40, color: '#007BFF', mr: 2 }} />
              <Typography variant="h4" component="h2" color="primary">
                Nuestra Historia
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              AMACARS nació en 2010 con la visión de transformar la experiencia del servicio automotriz. 
              Comenzamos como un pequeño taller y hemos crecido hasta convertirnos en un referente 
              en servicios mecánicos de alta calidad en la región.
            </Typography>
            <Typography variant="body1">
              Hoy, contamos con tecnología de punta y un equipo de profesionales altamente capacitados, 
              manteniendo siempre nuestro compromiso con la excelencia y el servicio personalizado 
              que nos ha caracterizado desde el primer día.
            </Typography>
          </Paper>
        </Grid>

        {/* Valores */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            Nuestros Valores
          </Typography>
          <Grid container spacing={3}>
            {valores.map((valor, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {valor.icono}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {valor.titulo}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {valor.descripcion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Equipo */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            Nuestro Equipo
          </Typography>
          <Grid container spacing={3}>
            {equipo.map((miembro, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          margin: '0 auto',
                          bgcolor: '#007BFF',
                          fontSize: '40px'
                        }}
                      >
                        {miembro.nombre.charAt(0)}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom align="center">
                      {miembro.nombre}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom align="center">
                      {miembro.cargo}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                      {miembro.experiencia}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Especialidad: {miembro.especialidad}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SobreNosotros; 