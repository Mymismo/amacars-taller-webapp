import React from 'react';
import {
  Box,
  Heading,
  Container,
  useToast,
  Text,
  Stack,
  Button,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Badge
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCitasCliente, cancelarCita } from '../../api/citas';
import { formatDate } from '../../utils/dates';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EstadoCita } from '../../types';
import { FiCalendar, FiClock, FiTool } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const MisCitas = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Mis Citas</Heading>
          <Button
            as={RouterLink}
            to="/citas/nueva"
            colorScheme="blue"
            leftIcon={<Icon as={FiCalendar} />}
          >
            Agendar Nueva Cita
          </Button>
        </HStack>

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

                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiCalendar} color="blue.500" />
                    <Text>{formatDate(cita.fecha)}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color="blue.500" />
                    <Text>{cita.hora}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiTool} color="blue.500" />
                    <Text>{cita.servicio.nombre}</Text>
                  </HStack>
                </VStack>

                <Box pt={2} width="100%">
                  <Text fontSize="sm" fontWeight="bold">
                    Vehículo:
                  </Text>
                  <Text>{`${cita.vehiculo.marca} ${cita.vehiculo.modelo}`}</Text>
                </Box>

                <HStack width="100%" spacing={2}>
                  <Button
                    width="100%"
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    as={RouterLink}
                    to={`/citas/${cita.id}`}
                  >
                    Ver Detalles
                  </Button>
                  {cita.estado === EstadoCita.PENDIENTE && (
                    <Button
                      width="100%"
                      colorScheme="red"
                      size="sm"
                      onClick={() => cancelarCitaMutation.mutate(cita.id)}
                      isLoading={cancelarCitaMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default MisCitas; 