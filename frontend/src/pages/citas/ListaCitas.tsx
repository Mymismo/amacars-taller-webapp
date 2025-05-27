import React from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    useToast,
    Button,
    Text,
    HStack,
    Icon,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { CitasList } from '../../modules/citas';
import { useAuth } from '../../contexts/AuthContext';

export const ListaCitas: React.FC = () => {
    const toast = useToast();
    const { user } = useAuth();

    const getFiltrosPorRol = () => {
        if (!user) return {};
        
        switch (user.rol) {
            case 'CLIENTE':
                return { usuario_id: user.id };
            case 'MECANICO':
                return { tecnico_id: user.id };
            case 'ADMIN':
            case 'RECEPCIONISTA':
                return {};
            default:
                return {};
        }
    };

    const getTituloPorRol = () => {
        if (!user) return 'Lista de Citas';
        
        switch (user.rol) {
            case 'CLIENTE':
                return 'Mis Citas';
            case 'MECANICO':
                return 'Citas Asignadas';
            case 'RECEPCIONISTA':
                return 'Gestión de Citas';
            case 'ADMIN':
                return 'Todas las Citas';
            default:
                return 'Lista de Citas';
        }
    };

    const getRutaNuevaCita = () => {
        if (!user) return '/nueva-cita';
        
        switch (user.rol) {
            case 'CLIENTE':
                return '/nueva-cita';
            case 'RECEPCIONISTA':
                return '/citas/agendar';
            default:
                return '/nueva-cita';
        }
    };

    const puedeCrearCitas = () => {
        return user?.rol === 'CLIENTE' || user?.rol === 'RECEPCIONISTA';
    };

    const handleEdit = (cita: any) => {
        // Por ahora solo mostraremos un toast
        toast({
            title: 'Función en desarrollo',
            description: 'La edición de citas estará disponible próximamente',
            status: 'info',
            duration: 3000,
        });
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg" color="amacars.primary.600">
                        {getTituloPorRol()}
                    </Heading>
                    {puedeCrearCitas() && (
                        <Button
                            as={RouterLink}
                            to={getRutaNuevaCita()}
                            colorScheme="amacars.primary"
                            leftIcon={<Icon as={FiCalendar} />}
                        >
                            {user?.rol === 'CLIENTE' ? 'Agendar Nueva Cita' : 'Crear Cita'}
                        </Button>
                    )}
                </HStack>

                <Box 
                    shadow="sm" 
                    rounded="lg" 
                    bg={useColorModeValue('white', 'gray.800')} 
                    p={4}
                >
                    <CitasList 
                        onEdit={handleEdit}
                        filtros={getFiltrosPorRol()}
                    />
                </Box>
            </VStack>
        </Container>
    );
}; 