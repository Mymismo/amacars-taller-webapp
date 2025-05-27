import React from 'react';
import {
    Box,
    Badge,
    IconButton,
    HStack,
    Text,
    useToast,
    VStack,
    SimpleGrid,
    useColorModeValue,
    Button,
    Icon
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiCalendar, FiClock, FiTool, FiUser, FiTruck } from 'react-icons/fi';
import { useCitas, useDeleteCita, useCambiarEstadoCita } from '../hooks';
import { Cita, EstadoCita, CitaFiltros } from '../types';

interface CitasListProps {
    onEdit?: (cita: Cita) => void;
    filtros?: CitaFiltros;
}

export const CitasList: React.FC<CitasListProps> = ({ onEdit, filtros }) => {
    const toast = useToast();
    const { data: citas, isLoading } = useCitas(filtros);
    const deleteCita = useDeleteCita();
    const cambiarEstado = useCambiarEstadoCita();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            try {
                await deleteCita.mutateAsync(id);
                toast({
                    title: 'Cita eliminada',
                    status: 'success',
                    duration: 3000,
                });
            } catch (error) {
                toast({
                    title: 'Error al eliminar la cita',
                    status: 'error',
                    duration: 3000,
                });
            }
        }
    };

    const getBadgeColor = (estado: EstadoCita) => {
        switch (estado) {
            case EstadoCita.PENDIENTE:
                return 'yellow';
            case EstadoCita.CONFIRMADA:
                return 'orange';
            case EstadoCita.EN_PROCESO:
                return 'blue';
            case EstadoCita.COMPLETADA:
                return 'green';
            case EstadoCita.CANCELADA:
                return 'red';
            default:
                return 'gray';
        }
    };

    const formatFechaHora = (fechaHora: string) => {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <Text>Cargando citas...</Text>;
    }

    if (!citas?.length) {
        return (
            <VStack spacing={4} align="center" py={8}>
                <Text>No hay citas para mostrar</Text>
            </VStack>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {citas.map((cita) => (
                <Box
                    key={cita.id}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                >
                    <VStack align="start" spacing={4}>
                        <HStack justify="space-between" width="100%">
                            <Badge colorScheme={getBadgeColor(cita.estado)}>
                                {cita.estado}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                                ID: {cita.id}
                            </Text>
                        </HStack>

                        <VStack align="start" spacing={2} width="100%">
                            <HStack>
                                <Icon as={FiCalendar} color="amacars.primary.500" />
                                <Text>{formatFechaHora(cita.fecha_hora)}</Text>
                            </HStack>
                            
                            <HStack>
                                <Icon as={FiUser} color="amacars.primary.500" />
                                <Text>{cita.usuario?.nombre_completo}</Text>
                            </HStack>

                            <HStack>
                                <Icon as={FiTruck} color="amacars.primary.500" />
                                <Text>
                                    {cita.vehiculo && 
                                        `${cita.vehiculo.marca} ${cita.vehiculo.modelo} - ${cita.vehiculo.matricula}`
                                    }
                                </Text>
                            </HStack>

                            <HStack>
                                <Icon as={FiTool} color="amacars.primary.500" />
                                <Text>{cita.servicios.map(s => s.nombre).join(", ")}</Text>
                            </HStack>
                        </VStack>

                        <HStack spacing={2} width="100%" justify="flex-end">
                            <IconButton
                                aria-label="Editar cita"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                onClick={() => onEdit?.(cita)}
                            />
                            <IconButton
                                aria-label="Eliminar cita"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDelete(cita.id)}
                            />
                        </HStack>
                    </VStack>
                </Box>
            ))}
        </SimpleGrid>
    );
}; 