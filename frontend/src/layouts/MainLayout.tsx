import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotificationsBar from '../components/NotificationsBar';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { auth } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {auth.isAuthenticated && <NotificationsBar />}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout; 