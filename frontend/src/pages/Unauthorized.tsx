import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        // Redirigir según el rol del usuario
        if (user?.rol === 'ADMIN') {
            navigate('/dashboard');
        } else if (user?.rol === 'MECANICO') {
            navigate('/citas-asignadas');
        } else if (user?.rol === 'RECEPCIONISTA') {
            navigate('/citas');
        } else {
            navigate('/mis-citas');
        }
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, red.400, red.600)"
                backgroundClip="text"
            >
                403
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Acceso No Autorizado
            </Text>
            <Text color={'gray.500'} mb={6}>
                No tienes permisos para acceder a esta página
            </Text>

            <Button
                colorScheme="red"
                bgGradient="linear(to-r, red.400, red.500, red.600)"
                color="white"
                variant="solid"
                onClick={handleGoBack}
            >
                Volver a Mi Página Principal
            </Button>
        </Box>
    );
};

export default Unauthorized; 