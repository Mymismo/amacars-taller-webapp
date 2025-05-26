import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, Flex, Image } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Flex minH="100vh" bg="gray.50">
            <Container maxW="container.xl" py={10}>
                <Flex direction={{ base: 'column', md: 'row' }} gap={8} align="center" justify="center">
                    <Box flex="1" textAlign="center">
                        <Image
                            src="/AMACARS_Logo.png"
                            alt="AMACARS Logo"
                            maxW="300px"
                            mx="auto"
                        />
                    </Box>
                    <Box
                        flex="1"
                        p={8}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="lg"
                    >
                        <Outlet />
                    </Box>
                </Flex>
            </Container>
        </Flex>
    );
};

export default AuthLayout; 