import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const contentBg = useColorModeValue('white', 'gray.800');

    return (
        <Box minH="100vh" display="flex" flexDirection="column" bg={bgColor}>
            <Navbar />
            <Flex flex="1">
                {isAuthenticated && (
                    <Box w="250px" display={{ base: 'none', md: 'block' }}>
                        <Sidebar />
                    </Box>
                )}
                <Box 
                    flex="1" 
                    py={8} 
                    px={{ base: 4, md: 8 }}
                >
                    <Container 
                        maxW="container.xl" 
                        bg={contentBg}
                        borderRadius="xl"
                        boxShadow="sm"
                        p={{ base: 4, md: 6 }}
                    >
                        <Outlet />
                    </Container>
                </Box>
            </Flex>
            <Footer />
        </Box>
    );
};

export default MainLayout; 