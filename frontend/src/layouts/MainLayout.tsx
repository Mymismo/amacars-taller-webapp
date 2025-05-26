import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Flex } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Flex>
                {isAuthenticated && <Sidebar />}
                <Box flex="1" py={8} px={4} bg="gray.50">
                    <Container maxW="container.xl">
                        <Outlet />
                    </Container>
                </Box>
            </Flex>
            <Footer />
        </Box>
    );
};

export default MainLayout; 