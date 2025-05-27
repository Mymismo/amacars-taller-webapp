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
    Button,
    HStack,
    VStack,
    useToast,
    Text,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { EstadoCita } from '../../types/cita';
import { getCitasAsignadas, actualizarEstadoCita } from '../../api/citas';

const CitasAsignadas = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: citas, isLoading } = useQuery({
        queryKey: ['citasAsignadas'],
        queryFn: getCitasAsignadas,
        onError: (error: any) => {
            toast({
                title: 'Error al cargar las citas',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const actualizarEstadoMutation = useMutation({
        mutationFn: actualizarEstadoCita,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['citasAsignadas'] });
            toast({
                title: 'Estado actualizado',
                description: 'El estado de la cita ha sido actualizado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error al actualizar el estado',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

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

    if (!citas?.length) {
        return (
            <Container maxW="container.xl" py={5}>
                <VStack spacing={4} align="center">
                    <Heading mb={5}>Mis Citas Asignadas</Heading>
                    <Text>No tienes citas asignadas en este momento</Text>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={5}>
            <VStack spacing={5}>
                <Heading>Mis Citas Asignadas</Heading>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Fecha</Th>
                            <Th>Hora</Th>
                            <Th>Cliente</Th>
                            <Th>Vehículo</Th>
                            <Th>Servicio</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {citas.map((cita) => (
                            <Tr key={cita.id}>
                                <Td>{new Date(cita.fecha).toLocaleDateString()}</Td>
                                <Td>{cita.hora}</Td>
                                <Td>{`${cita.cliente.nombre} ${cita.cliente.apellidos}`}</Td>
                                <Td>{`${cita.vehiculo.marca} ${cita.vehiculo.modelo}`}</Td>
                                <Td>{cita.servicio.nombre}</Td>
                                <Td>
                                    <Badge colorScheme={getBadgeColor(cita.estado)}>
                                        {cita.estado}
                                    </Badge>
                                </Td>
                                <Td>
                                    <HStack spacing={2}>
                                        {cita.estado === EstadoCita.CONFIRMADA && (
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={() => actualizarEstadoMutation.mutate({
                                                    citaId: cita.id,
                                                    estado: EstadoCita.EN_PROCESO
                                                })}
                                            >
                                                Iniciar Servicio
                                            </Button>
                                        )}
                                        {cita.estado === EstadoCita.EN_PROCESO && (
                                            <Button
                                                size="sm"
                                                colorScheme="green"
                                                onClick={() => actualizarEstadoMutation.mutate({
                                                    citaId: cita.id,
                                                    estado: EstadoCita.COMPLETADA
                                                })}
                                            >
                                                Completar Servicio
                                            </Button>
                                        )}
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </VStack>
        </Container>
    );
};

export default CitasAsignadas; 