import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  CardActions,
  Paper
} from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface NovedadProps {
  titulo: string;
  descripcion: string;
  imagen: string;
  fecha: string;
  tipo: 'promocion' | 'evento' | 'servicio';
  etiquetas: string[];
}

const novedades: NovedadProps[] = [
  {
    titulo: "Nuevo Servicio de Diagnóstico Computarizado",
    descripcion: "Incorporamos tecnología de última generación para diagnóstico preciso de sistemas electrónicos. Detecta problemas antes de que se conviertan en averías mayores.",
    imagen: "/images/diagnostico.jpg",
    fecha: "Mayo 2024",
    tipo: "servicio",
    etiquetas: ["Tecnología", "Diagnóstico", "Innovación"]
  },
  {
    titulo: "Promoción Especial en Mantenimiento",
    descripcion: "20% de descuento en servicios de mantenimiento preventivo. Incluye cambio de aceite, filtros y revisión de 32 puntos.",
    imagen: "/images/promocion.jpg",
    fecha: "Junio 2024",
    tipo: "promocion",
    etiquetas: ["Descuento", "Mantenimiento", "Oferta Limitada"]
  },
  {
    titulo: "Feria de Seguridad Vehicular",
    descripcion: "Únete a nuestra feria donde expertos compartirán consejos sobre seguridad vehicular. Revisiones gratuitas de frenos y luces.",
    imagen: "/images/feria.jpg",
    fecha: "Julio 2024",
    tipo: "evento",
    etiquetas: ["Evento", "Seguridad", "Gratuito"]
  }
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'promocion':
      return <LocalOfferIcon sx={{ color: '#e65100' }} />;
    case 'evento':
      return <EventIcon sx={{ color: '#2e7d32' }} />;
    case 'servicio':
      return <NewReleasesIcon sx={{ color: '#1976d2' }} />;
    default:
      return null;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'promocion':
      return '#fff3e0';
    case 'evento':
      return '#e8f5e9';
    case 'servicio':
      return '#e3f2fd';
    default:
      return '#ffffff';
  }
};

const NovedadCard = ({ novedad }: { novedad: NovedadProps }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: getTipoColor(novedad.tipo)
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={novedad.imagen}
        alt={novedad.titulo}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getTipoIcon(novedad.tipo)}
          <Typography variant="h5" component="div" sx={{ ml: 1 }}>
            {novedad.titulo}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          {novedad.descripcion}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {novedad.etiquetas.map((etiqueta, index) => (
            <Chip
              key={index}
              label={etiqueta}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {novedad.fecha}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Leer más
        </Button>
      </CardActions>
    </Card>
  );
};

const Novedades = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Novedades y Actualizaciones
      </Typography>
      <Typography variant="body1" paragraph>
        Mantente al día con las últimas novedades y mejoras en nuestro taller.
      </Typography>

      <Grid container spacing={4}>
        {novedades.map((novedad, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}>
              <CardMedia
                component="img"
                height="250"
                image={novedad.imagen}
                alt={novedad.titulo}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={novedad.tipo}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    {new Date(novedad.fecha).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {novedad.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {novedad.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Novedades; 