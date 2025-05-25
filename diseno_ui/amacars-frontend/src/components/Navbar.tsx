import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  return (
    <AppBar 
      position="static"
      sx={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#007BFF'
      }}
    >
      <Toolbar sx={{ minHeight: '90px !important', pl: 3, py: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 6,
          height: '90px',
          '&:hover': {
            cursor: 'pointer'
          }
        }}>
          <RouterLink to="/">
            <Logo variant="navbar" width="auto" height="90px" />
          </RouterLink>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            disableRipple
            sx={{ 
              mx: 1.5,
              fontSize: '1.4rem',
              textTransform: 'none',
              py: 1,
              fontWeight: 500,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            Inicio
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/vehiculos"
            disableRipple
            sx={{ 
              mx: 1.5,
              fontSize: '1.4rem',
              textTransform: 'none',
              py: 1,
              fontWeight: 500,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            Vehículos
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/citas"
            disableRipple
            sx={{ 
              mx: 1.5,
              fontSize: '1.4rem',
              textTransform: 'none',
              py: 1,
              fontWeight: 500,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            Citas
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/servicios"
            disableRipple
            sx={{ 
              mx: 1.5,
              fontSize: '1.4rem',
              textTransform: 'none',
              py: 1,
              fontWeight: 500,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            Servicios
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 