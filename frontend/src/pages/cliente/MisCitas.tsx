import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Container,
  useToast,
  Text,
  Stack,
  Button,
  IconButton,
  HStack
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCitasCliente, cancelarCita } from '../../api/citas';
import { formatDate } from '../../utils/dates';
import { useNavigate } from 'react-router-dom';

const MisCitas = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: citas, isLoading } = useQuery({
    queryKey: ['citasCliente'],
    queryFn: getCitasCliente,
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

  const cancelarCitaMutation = useMutation({
    mutationFn: cancelarCita,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citasCliente'] });
      toast({
        title: 'Cita cancelada',
        description: 'La cita ha sido cancelada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al cancelar la cita',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  if (isLoading) {
    return <Box>Cargando...</Box>;
  }

  if (!citas?.length) {
    return (
      <Container maxW="container.xl" py={5}>
        <Stack spacing={4} align="center">
          <Heading mb={5}>Mis Citas</Heading>
          <Text>No tienes citas programadas</Text>
          <Button colorScheme="blue" onClick={() => navigate('/citas/nueva')}>
            Agendar una cita
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Stack spacing={5}>
        <HStack justify="space-between">
          <Heading>Mis Citas</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/citas/nueva')}>
            Agendar cita
          </Button>
        </HStack>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Fecha y Hora</Th>
              <Th>Vehículo</Th>
              <Th>Servicios</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {citas.map((cita) => (
              <Tr key={cita.id}>
                <Td>{formatDate(cita.fecha_hora)}</Td>
                <Td>{cita.vehiculo?.marca} {cita.vehiculo?.modelo}</Td>
                <Td>
                  <Stack>
                    {cita.servicios.map((servicio) => (
                      <Text key={servicio.id}>{servicio.nombre}</Text>
                    ))}
                  </Stack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      cita.estado === 'PENDIENTE'
                        ? 'yellow'
                        : cita.estado === 'CONFIRMADA'
                        ? 'green'
                        : cita.estado === 'EN_PROCESO'
                        ? 'blue'
                        : cita.estado === 'COMPLETADA'
                        ? 'green'
                        : 'red'
                    }
                  >
                    {cita.estado}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {cita.estado === 'PENDIENTE' && (
                      <>
                        <IconButton
                          aria-label="Editar cita"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => navigate(`/citas/editar/${cita.id}`)}
                        />
                        <IconButton
                          aria-label="Cancelar cita"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => cancelarCitaMutation.mutate(cita.id)}
                        />
                      </>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default MisCitas; 