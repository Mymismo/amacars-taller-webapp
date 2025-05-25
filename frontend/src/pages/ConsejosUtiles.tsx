import { Container, Typography } from '@mui/material';

const ConsejosUtiles = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Consejos Útiles
      </Typography>
      <Typography paragraph>
        Aquí encontrarás consejos útiles para el mantenimiento de tu vehículo.
      </Typography>
    </Container>
  );
};

export default ConsejosUtiles; 