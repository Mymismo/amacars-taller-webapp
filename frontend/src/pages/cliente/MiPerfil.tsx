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
  HStack,
  Avatar,
  Divider,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser, FaCar, FaCalendarAlt, FaTools } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { actualizarUsuario } from '../../api/usuarios';
import { getVehiculosCliente } from '../../api/vehiculos';
import { getCitasCliente } from '../../api/citas';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiTruck, FiEdit2 } from 'react-icons/fi';

interface ProfileFormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
}

const MiPerfil = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const bgBox = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileFormData>();

  const { data: vehiculos = [], isLoading: isLoadingVehiculos } = useQuery({
    queryKey: ['vehiculosCliente'],
    queryFn: getVehiculosCliente,
    enabled: !!user,
  });

  const { data: citas = [], isLoading: isLoadingCitas } = useQuery({
    queryKey: ['citasCliente'],
    queryFn: getCitasCliente,
    enabled: !!user,
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
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar el perfil',
        description: error.message || 'Ha ocurrido un error al actualizar el perfil',
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
        direccion: user.direccion || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    actualizarPerfilMutation.mutate(data);
  };

  if (!user || isLoadingVehiculos || isLoadingCitas) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">Cargando...</Box>
      </Container>
    );
  }

  const estadisticas = {
    totalCitas: citas.length,
    citasPendientes: citas.filter(cita => 
      cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'
    ).length,
    vehiculosRegistrados: vehiculos.length,
    ultimaCita: citas.length > 0 ? 
      new Date(Math.max(...citas.map(c => new Date(c.fecha).getTime()))).toLocaleDateString() : 
      'Sin citas'
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          bg={bgBox}
          p={8}
          borderRadius="xl"
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="center">
            <Avatar
              size="2xl"
              name={`${user.nombre} ${user.apellidos}`}
              src={user.avatar}
              bg="amacars.primary.500"
            />
            <VStack spacing={2}>
              <Heading size="lg" color="amacars.primary.600">
                {user.nombre} {user.apellidos}
              </Heading>
              <Text color="gray.500">
                Cliente desde {new Date(user.fecha_registro).getFullYear()}
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
              <HStack>
                <Icon as={FiMail} color="amacars.primary.500" />
                <Text>{user.email}</Text>
              </HStack>
              <HStack>
                <Icon as={FiPhone} color="amacars.primary.500" />
                <Text>{user.telefono || 'No especificado'}</Text>
              </HStack>
              <HStack>
                <Icon as={FiMapPin} color="amacars.primary.500" />
                <Text>{user.direccion || 'No especificada'}</Text>
              </HStack>
            </SimpleGrid>

            <Button
              leftIcon={<FiEdit2 />}
              colorScheme="amacars.primary"
              variant="outline"
              onClick={onOpen}
            >
              Editar Perfil
            </Button>
          </VStack>
        </Box>

        <Heading size="md" color="amacars.primary.600">
          Resumen de Actividad
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <VStack>
                <Icon as={FiCalendar} boxSize={6} color="amacars.primary.500" />
                <Text fontWeight="bold" fontSize="2xl">
                  {estadisticas.totalCitas}
                </Text>
                <Text color="gray.500">Total de Citas</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack>
                <Icon as={FiCalendar} boxSize={6} color="orange.500" />
                <Text fontWeight="bold" fontSize="2xl">
                  {estadisticas.citasPendientes}
                </Text>
                <Text color="gray.500">Citas Pendientes</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack>
                <Icon as={FiTruck} boxSize={6} color="green.500" />
                <Text fontWeight="bold" fontSize="2xl">
                  {estadisticas.vehiculosRegistrados}
                </Text>
                <Text color="gray.500">Vehículos Registrados</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack>
                <Icon as={FiCalendar} boxSize={6} color="purple.500" />
                <Text fontWeight="bold" fontSize="lg">
                  {estadisticas.ultimaCita}
                </Text>
                <Text color="gray.500">Última Cita</Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      {/* Modal de Edición de Perfil */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="amacars.primary.600">Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <VStack spacing={4}>
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

                <FormControl isInvalid={!!errors.direccion}>
                  <FormLabel>Dirección</FormLabel>
                  <Input
                    {...register('direccion')}
                  />
                  <FormErrorMessage>
                    {errors.direccion && errors.direccion.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="amacars.primary"
                isLoading={isSubmitting}
                type="submit"
              >
                Guardar Cambios
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default MiPerfil; 