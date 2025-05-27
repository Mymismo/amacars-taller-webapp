import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Button,
    useToast,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    Divider,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { register as registerUser } from '../../api/auth';

interface TestUser {
    nombre_completo: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    rol?: string;
}

const testUsers: TestUser[] = [
    {
        nombre_completo: 'Cliente de Prueba',
        email: 'cliente@amacars.com',
        password: 'Cliente123!',
        telefono: '123456789',
        direccion: 'Calle Cliente, 123',
        rol: 'CLIENTE'
    },
    {
        nombre_completo: 'Mecánico de Prueba',
        email: 'mecanico@amacars.com',
        password: 'Mecanico123!',
        telefono: '123456789',
        direccion: 'Calle Mecánico, 123',
        rol: 'MECANICO'
    },
    {
        nombre_completo: 'Recepcionista de Prueba',
        email: 'recepcion@amacars.com',
        password: 'Recepcion123!',
        telefono: '123456789',
        direccion: 'Calle Recepción, 123',
        rol: 'RECEPCIONISTA'
    },
    {
        nombre_completo: 'Administrador de Prueba',
        email: 'admin@amacars.com',
        password: 'Admin123!',
        telefono: '123456789',
        direccion: 'Calle Admin, 123',
        rol: 'ADMIN'
    }
];

const TestLogin = () => {
    const { login } = useAuth();
    const toast = useToast();
    const [creatingUser, setCreatingUser] = useState<string | null>(null);

    const createTestUser = async (user: TestUser) => {
        setCreatingUser(user.email);
        try {
            await registerUser(user);
            toast({
                title: 'Usuario creado',
                description: `El usuario ${user.rol?.toLowerCase()} ha sido creado exitosamente`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Intentar iniciar sesión automáticamente
            await testLogin(user);
        } catch (error: any) {
            toast({
                title: 'Error al crear usuario',
                description: error.response?.data?.detail || `No se pudo crear el usuario ${user.rol?.toLowerCase()}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setCreatingUser(null);
        }
    };

    const testLogin = async (user: TestUser) => {
        try {
            await login(user.email, user.password);
            toast({
                title: 'Inicio de sesión exitoso',
                description: `Has iniciado sesión como ${user.rol?.toLowerCase()}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast({
                    title: 'Usuario no existe',
                    description: `El usuario ${user.rol?.toLowerCase()} no existe. ¿Deseas crearlo?`,
                    status: 'warning',
                    duration: null,
                    isClosable: true,
                    action: (
                        <Button colorScheme="blue" size="sm" onClick={() => createTestUser(user)}>
                            Crear usuario
                        </Button>
                    ),
                });
            } else {
                toast({
                    title: 'Error al iniciar sesión',
                    description: error.response?.data?.detail || 'Error al intentar iniciar sesión',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Box p={8}>
            <VStack spacing={8} align="stretch">
                <Heading size="lg" textAlign="center">
                    Usuarios de Prueba
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {testUsers.map((user) => (
                        <Card key={user.email}>
                            <CardHeader>
                                <Heading size="md">{user.rol}</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack align="stretch" spacing={2}>
                                    <Text><strong>Email:</strong> {user.email}</Text>
                                    <Text><strong>Contraseña:</strong> {user.password}</Text>
                                </VStack>
                            </CardBody>
                            <Divider />
                            <CardFooter>
                                <Button
                                    colorScheme="blue"
                                    width="full"
                                    onClick={() => testLogin(user)}
                                    isLoading={creatingUser === user.email}
                                >
                                    Iniciar Sesión
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>

                <Text fontSize="sm" textAlign="center" color="gray.500">
                    Nota: Si un usuario no existe, se te dará la opción de crearlo automáticamente.
                </Text>
            </VStack>
        </Box>
    );
};

export default TestLogin; 