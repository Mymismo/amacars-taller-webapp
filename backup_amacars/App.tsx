import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehiculos from './pages/Vehiculos';
import Citas from './pages/Citas';
import Servicios from './pages/Servicios';
import SobreNosotros from './pages/SobreNosotros';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
