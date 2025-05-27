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
    Select,
    Input,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { EstadoCita } from '../../types/cita';
import { getAllCitas, actualizarEstadoCita, asignarMecanico } from '../../api/citas';

const GestionCitas = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [filtros, setFiltros] = React.useState({
        fecha: '',
        estado: '',
    });

    const { data: citas, isLoading } = useQuery({
        queryKey: ['todasLasCitas', filtros],
        queryFn: () => getAllCitas({
            fecha: filtros.fecha || undefined,
            estado: filtros.estado as EstadoCita || undefined,
        }),
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

    const asignarMecanicoMutation = useMutation({
        mutationFn: ({ citaId, mecanicoId }: { citaId: string, mecanicoId: string }) => 
            asignarMecanico(citaId, mecanicoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todasLasCitas'] });
            toast({
                title: 'Mecánico asignado',
                description: 'El mecánico ha sido asignado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error al asignar mecánico',
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
            queryClient.invalidateQueries({ queryKey: ['todasLasCitas'] });
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
                title: 'Error al actualizar estado',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                <Heading>Gestión de Citas</Heading>

                {/* Filtros */}
                <Box width="100%" p={4} borderWidth={1} borderRadius="md">
                    <HStack spacing={4}>
                        <FormControl>
                            <FormLabel>Fecha</FormLabel>
                            <Input
                                type="date"
                                name="fecha"
                                value={filtros.fecha}
                                onChange={handleFiltroChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Estado</FormLabel>
                            <Select
                                name="estado"
                                value={filtros.estado}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos</option>
                                {Object.values(EstadoCita).map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </HStack>
                </Box>

                {!citas?.length ? (
                    <Text>No hay citas para mostrar</Text>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Fecha</Th>
                                <Th>Hora</Th>
                                <Th>Cliente</Th>
                                <Th>Vehículo</Th>
                                <Th>Servicio</Th>
                                <Th>Mecánico</Th>
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
                                        {cita.mecanico ? 
                                            `${cita.mecanico.nombre} ${cita.mecanico.apellidos}` : 
                                            <Select
                                                placeholder="Asignar mecánico"
                                                size="sm"
                                                onChange={(e) => asignarMecanicoMutation.mutate({
                                                    citaId: cita.id,
                                                    mecanicoId: e.target.value
                                                })}
                                            >
                                                {/* TODO: Agregar lista de mecánicos disponibles */}
                                                <option value="mecanico1">Mecánico 1</option>
                                                <option value="mecanico2">Mecánico 2</option>
                                            </Select>
                                        }
                                    </Td>
                                    <Td>
                                        <Badge colorScheme={getBadgeColor(cita.estado)}>
                                            {cita.estado}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            {cita.estado === EstadoCita.PENDIENTE && (
                                                <Button
                                                    size="sm"
                                                    colorScheme="green"
                                                    onClick={() => actualizarEstadoMutation.mutate({
                                                        citaId: cita.id,
                                                        estado: EstadoCita.CONFIRMADA
                                                    })}
                                                >
                                                    Confirmar
                                                </Button>
                                            )}
                                            {cita.estado !== EstadoCita.CANCELADA && cita.estado !== EstadoCita.COMPLETADA && (
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => actualizarEstadoMutation.mutate({
                                                        citaId: cita.id,
                                                        estado: EstadoCita.CANCELADA
                                                    })}
                                                >
                                                    Cancelar
                                                </Button>
                                            )}
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </VStack>
        </Container>
    );
};

export default GestionCitas; 