import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    HStack,
    Text,
    useToast,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useServicios, useDeleteServicio, useToggleServicioActivo } from '../hooks';
import { Servicio } from '../types';

interface ServiciosListProps {
    onEdit?: (servicio: Servicio) => void;
}

export const ServiciosList: React.FC<ServiciosListProps> = ({ onEdit }) => {
    const toast = useToast();
    const { data: servicios, isLoading } = useServicios();
    const deleteServicio = useDeleteServicio();
    const toggleActivo = useToggleServicioActivo();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            try {
                await deleteServicio.mutateAsync(id);
                toast({
                    title: 'Servicio eliminado',
                    status: 'success',
                    duration: 3000,
                });
            } catch (error) {
                toast({
                    title: 'Error al eliminar el servicio',
                    status: 'error',
                    duration: 3000,
                });
            }
        }
    };

    const handleToggleActivo = async (id: number) => {
        try {
            await toggleActivo.mutateAsync(id);
            toast({
                title: 'Estado actualizado',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Error al actualizar el estado',
                status: 'error',
                duration: 3000,
            });
        }
    };

    if (isLoading) {
        return <Text>Cargando servicios...</Text>;
    }

    return (
        <Box overflowX="auto">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nombre</Th>
                        <Th>Descripción</Th>
                        <Th isNumeric>Precio</Th>
                        <Th isNumeric>Duración (min)</Th>
                        <Th>Estado</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {servicios?.map((servicio) => (
                        <Tr key={servicio.id}>
                            <Td>{servicio.nombre}</Td>
                            <Td>{servicio.descripcion}</Td>
                            <Td isNumeric>€{servicio.precio}</Td>
                            <Td isNumeric>{servicio.duracion_estimada}</Td>
                            <Td>
                                <Badge
                                    cursor="pointer"
                                    onClick={() => handleToggleActivo(servicio.id)}
                                    colorScheme={servicio.activo ? 'green' : 'red'}
                                >
                                    {servicio.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Td>
                            <Td>
                                <HStack spacing={2}>
                                    <IconButton
                                        aria-label="Editar servicio"
                                        icon={<EditIcon />}
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => onEdit?.(servicio)}
                                    />
                                    <IconButton
                                        aria-label="Eliminar servicio"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => handleDelete(servicio.id)}
                                    />
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}; 