import React from 'react';
import {
    Box,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    VStack,
    useToast,
    Text,
    Input,
    HStack,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { EstadoCita } from '../../types/cita';
import { getHistorialServicios } from '../../api/citas';

const HistorialServicios = () => {
    const toast = useToast();
    const { user } = useAuth();
    const [filtros, setFiltros] = React.useState({
        fechaInicio: '',
        fechaFin: '',
    });

    const { data: servicios, isLoading } = useQuery({
        queryKey: ['historialServicios', filtros],
        queryFn: () => getHistorialServicios(filtros),
        onError: (error: any) => {
            toast({
                title: 'Error al cargar el historial',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getBadgeColor = (estado: EstadoCita) => {
        switch (estado) {
            case EstadoCita.PENDIENTE:
                return 'yellow';
            case EstadoCita.CONFIRMADA:
                return 'green';
            case EstadoCita.EN_PROCESO:
                return 'blue';
            case EstadoCita.COMPLETADA:
                return 'purple';
            case EstadoCita.CANCELADA:
                return 'red';
            default:
                return 'gray';
        }
    };

    if (isLoading) {
        return <Box>Cargando...</Box>;
    }

    return (
        <Container maxW="container.xl" py={5}>
            <VStack spacing={5}>
                <Heading>Historial de Servicios</Heading>

                {/* Filtros */}
                <Box width="100%" p={4} borderWidth={1} borderRadius="md">
                    <VStack spacing={4}>
                        <HStack spacing={4} width="100%">
                            <FormControl>
                                <FormLabel>Fecha Inicio</FormLabel>
                                <Input
                                    type="date"
                                    name="fechaInicio"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Fecha Fin</FormLabel>
                                <Input
                                    type="date"
                                    name="fechaFin"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                />
                            </FormControl>
                        </HStack>
                    </VStack>
                </Box>

                {!servicios?.length ? (
                    <Text>No hay servicios en el historial para mostrar</Text>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Fecha</Th>
                                <Th>Cliente</Th>
                                <Th>Vehículo</Th>
                                <Th>Servicio</Th>
                                <Th>Estado</Th>
                                <Th>Notas</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {servicios.map((servicio) => (
                                <Tr key={servicio.id}>
                                    <Td>{new Date(servicio.fecha).toLocaleDateString()}</Td>
                                    <Td>{`${servicio.cliente.nombre} ${servicio.cliente.apellidos}`}</Td>
                                    <Td>{`${servicio.vehiculo.marca} ${servicio.vehiculo.modelo}`}</Td>
                                    <Td>{servicio.servicio.nombre}</Td>
                                    <Td>
                                        <Badge colorScheme={getBadgeColor(servicio.estado)}>
                                            {servicio.estado}
                                        </Badge>
                                    </Td>
                                    <Td>{servicio.notas || '-'}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </VStack>
        </Container>
    );
};

export default HistorialServicios; 