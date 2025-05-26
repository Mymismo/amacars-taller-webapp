import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  VStack,
  Text,
  FormErrorMessage,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  HStack
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser, FaCar, FaCalendarAlt, FaTools } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { actualizarUsuario } from '../../api/usuarios';
import { getVehiculosCliente } from '../../api/vehiculos';
import { getCitasCliente } from '../../api/citas';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

const MiPerfil = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileFormData>();

  const { data: vehiculos } = useQuery({
    queryKey: ['vehiculosCliente'],
    queryFn: getVehiculosCliente,
  });

  const { data: citas } = useQuery({
    queryKey: ['citasCliente'],
    queryFn: getCitasCliente,
  });

  const actualizarPerfilMutation = useMutation({
    mutationFn: (data: ProfileFormData) => actualizarUsuario(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios han sido guardados exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar el perfil',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    actualizarPerfilMutation.mutate(data);
  };

  if (!user) {
    return <Box>Cargando...</Box>;
  }

  const citasPendientes = citas?.filter(cita => 
    cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'
  ).length || 0;

  const vehiculosActivos = vehiculos?.filter(v => v.activo).length || 0;

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={8} align="stretch">
        <Heading>Mi Perfil</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.nombre}>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      {...register('nombre', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.nombre && errors.nombre.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.apellidos}>
                    <FormLabel>Apellidos</FormLabel>
                    <Input
                      {...register('apellidos', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.apellidos && errors.apellidos.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...register('email', {
                        required: 'Este campo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.telefono}>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                      {...register('telefono', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Teléfono inválido (10 dígitos)',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.telefono && errors.telefono.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    mt={4}
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Guardar Cambios
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>

          <VStack spacing={4}>
            <SimpleGrid columns={2} spacing={4} width="100%">
              <Card>
                <CardBody>
                  <VStack>
                    <Icon as={FaCar} boxSize={8} color="blue.500" />
                    <Text fontSize="2xl" fontWeight="bold">{vehiculosActivos}</Text>
                    <Text>Vehículos</Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/vehiculos')}
                    >
                      Ver todos
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <VStack>
                    <Icon as={FaCalendarAlt} boxSize={8} color="green.500" />
                    <Text fontSize="2xl" fontWeight="bold">{citasPendientes}</Text>
                    <Text>Citas Pendientes</Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/citas')}
                    >
                      Ver todas
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card width="100%">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Icon as={FaTools} color="purple.500" />
                    <Text fontWeight="bold">Acciones Rápidas</Text>
                  </HStack>
                  <Button
                    width="100%"
                    onClick={() => navigate('/citas/nueva')}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Agendar Nueva Cita
                  </Button>
                  <Button
                    width="100%"
                    onClick={() => navigate('/vehiculos/nuevo')}
                    colorScheme="green"
                    variant="outline"
                  >
                    Registrar Vehículo
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default MiPerfil; 