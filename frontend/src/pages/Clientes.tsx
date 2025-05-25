import { Container, Typography } from '@mui/material';
import ClientesList from '../components/ClientesList';

const Clientes = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Clientes
      </Typography>
      <ClientesList />
    </Container>
  );
};

export default Clientes; 