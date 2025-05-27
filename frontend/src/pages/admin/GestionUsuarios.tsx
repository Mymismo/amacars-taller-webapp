import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Heading,
    useToast,
    Badge,
    HStack,
    IconButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { axiosInstance } from '../../api/config';

interface Usuario {
    id: number;
    nombre_completo: string;
    email: string;
    rol: string;
    activo: boolean;
}

const GestionUsuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const { user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axiosInstance.get('/usuarios');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudieron cargar los usuarios',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        if (user?.rol === 'ADMIN') {
            fetchUsuarios();
        }
    }, [user, toast]);

    return (
        <Container maxW="container.xl" py={5}>
            <Box mb={5}>
                <Heading size="lg" mb={4}>
                    Gestión de Usuarios
                </Heading>

                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    mb={5}
                >
                    Nuevo Usuario
                </Button>

                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>Email</Th>
                                <Th>Rol</Th>
                                <Th>Estado</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usuarios.map((usuario) => (
                                <Tr key={usuario.id}>
                                    <Td>{usuario.id}</Td>
                                    <Td>{usuario.nombre_completo}</Td>
                                    <Td>{usuario.email}</Td>
                                    <Td>{usuario.rol}</Td>
                                    <Td>
                                        <Badge
                                            colorScheme={usuario.activo ? 'green' : 'red'}
                                        >
                                            {usuario.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                aria-label="Editar usuario"
                                                icon={<EditIcon />}
                                                size="sm"
                                                colorScheme="blue"
                                            />
                                            <IconButton
                                                aria-label="Eliminar usuario"
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Container>
    );
};

export default GestionUsuarios; 