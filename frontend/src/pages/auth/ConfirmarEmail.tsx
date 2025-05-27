import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { confirmarEmail, reenviarConfirmacion } from '../../api/auth';

const ConfirmarEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const confirmar = async () => {
            if (!token) {
                setError('Token de confirmación no válido');
                setIsLoading(false);
                return;
            }

            try {
                await confirmarEmail(token);
                setIsLoading(false);
            } catch (error: any) {
                setError(error.response?.data?.detail || 'Error al confirmar el email');
                if (error.response?.data?.email) {
                    setEmail(error.response.data.email);
                }
                setIsLoading(false);
            }
        };

        confirmar();
    }, [token]);

    const handleReenviar = async () => {
        if (!email) return;

        try {
            await reenviarConfirmacion(email);
            toast({
                title: 'Email enviado',
                description: 'Se ha enviado un nuevo email de confirmación',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Error al reenviar el email de confirmación',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Confirmando tu email...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <VStack spacing={6}>
                {error ? (
                    <>
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                        {email && (
                            <Button
                                colorScheme="blue"
                                onClick={handleReenviar}
                            >
                                Reenviar email de confirmación
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <Heading size="lg">¡Email Confirmado!</Heading>
                        <Text>Tu cuenta ha sido verificada exitosamente.</Text>
                        <Button
                            colorScheme="blue"
                            onClick={() => navigate('/login')}
                        >
                            Ir a Iniciar Sesión
                        </Button>
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default ConfirmarEmail; 