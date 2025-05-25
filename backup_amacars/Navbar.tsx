import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#007BFF' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AMACARS
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/vehiculos"
            startIcon={<DirectionsCarIcon />}
          >
            Vehículos
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/citas"
            startIcon={<CalendarMonthIcon />}
          >
            Citas
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/servicios"
            startIcon={<BuildIcon />}
          >
            Servicios
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/sobre-nosotros"
            startIcon={<GroupsIcon />}
          >
            Nosotros
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 