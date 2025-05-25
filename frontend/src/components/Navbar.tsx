import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PeopleIcon from '@mui/icons-material/People';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const buttonStyle = {
    fontSize: '1.1rem',
    textTransform: 'none',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    '&:hover': {
      background: 'transparent',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#007BFF' }}>
      <Toolbar sx={{ minHeight: '80px' }}>
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
            mr: 4,
          }}
        >
          <img src={logo} alt="AMACARS Logo" style={{ height: '40px' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, ml: 'auto', flexWrap: 'wrap' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            sx={buttonStyle}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/clientes"
            startIcon={<PeopleIcon />}
            sx={buttonStyle}
          >
            Clientes
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/vehiculos"
            startIcon={<DirectionsCarIcon />}
            sx={buttonStyle}
          >
            Vehículos
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/citas"
            startIcon={<CalendarMonthIcon />}
            sx={buttonStyle}
          >
            Citas
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/servicios"
            startIcon={<BuildIcon />}
            sx={buttonStyle}
          >
            Servicios
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/consejos"
            startIcon={<TipsAndUpdatesIcon />}
            sx={buttonStyle}
          >
            Consejos
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/novedades"
            startIcon={<NewReleasesIcon />}
            sx={buttonStyle}
          >
            Novedades
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/sobre-nosotros"
            startIcon={<GroupsIcon />}
            sx={buttonStyle}
          >
            Nosotros
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 