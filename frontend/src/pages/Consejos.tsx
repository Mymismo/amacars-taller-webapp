import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';

const consejos = [
  {
    titulo: 'Mantenimiento Regular',
    descripcion: 'Realiza el mantenimiento de tu vehículo según el calendario recomendado por el fabricante.',
    imagen: 'https://via.placeholder.com/300x200',
  },
  {
    titulo: 'Presión de Neumáticos',
    descripcion: 'Revisa la presión de los neumáticos mensualmente para mejorar el rendimiento y la seguridad.',
    imagen: 'https://via.placeholder.com/300x200',
  },
  {
    titulo: 'Cambio de Aceite',
    descripcion: 'Cambia el aceite regularmente para mantener el motor en buen estado.',
    imagen: 'https://via.placeholder.com/300x200',
  },
];

const Consejos = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Consejos y Recomendaciones
      </Typography>
      <Typography variant="body1" paragraph>
        Mantén tu vehículo en óptimas condiciones con estos consejos útiles.
      </Typography>

      <Grid container spacing={4}>
        {consejos.map((consejo, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={consejo.imagen}
                alt={consejo.titulo}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {consejo.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {consejo.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Consejos; 