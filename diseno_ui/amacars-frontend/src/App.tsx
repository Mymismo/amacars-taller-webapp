import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Vehiculos from './pages/Vehiculos';
import Citas from './pages/Citas';
import Servicios from './pages/Servicios';

// Crear un tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
      light: '#3395ff',
      dark: '#0056b3',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/servicios" element={<Servicios />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
