import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  useToast,
  Select,
  Textarea,
  FormErrorMessage,
  VStack,
  Checkbox,
  Text
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { crearCita } from '../../api/citas';
import { getVehiculosCliente } from '../../api/vehiculos';
import { getServicios } from '../../api/servicios';
import { CitaCreate } from '../../types/cita';
import { useAuth } from '../../contexts/AuthContext';

const NuevaCita = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CitaCreate>();

  const { data: vehiculos, isLoading: isLoadingVehiculos } = useQuery({
    queryKey: ['vehiculosCliente'],
    queryFn: getVehiculosCliente,
  });

  const { data: servicios, isLoading: isLoadingServicios } = useQuery({
    queryKey: ['servicios'],
    queryFn: getServicios,
  });

  const crearCitaMutation = useMutation({
    mutationFn: crearCita,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citasCliente'] });
      toast({
        title: 'Cita creada',
        description: 'La cita ha sido agendada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/citas');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al agendar la cita',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = async (data: CitaCreate) => {
    if (!user) return;
    
    const citaData: CitaCreate = {
      ...data,
      usuario_id: user.id,
      fecha_hora: new Date(data.fecha_hora).toISOString(),
    };

    crearCitaMutation.mutate(citaData);
  };

  if (isLoadingVehiculos || isLoadingServicios) {
    return <Box>Cargando...</Box>;
  }

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={5} align="stretch">
        <Heading>Agendar Nueva Cita</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.vehiculo_id}>
              <FormLabel>Vehículo</FormLabel>
              <Controller
                name="vehiculo_id"
                control={control}
                rules={{ required: 'Debe seleccionar un vehículo' }}
                render={({ field }) => (
                  <Select placeholder="Seleccione un vehículo" {...field}>
                    {vehiculos?.map((vehiculo) => (
                      <option key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <FormErrorMessage>
                {errors.vehiculo_id && errors.vehiculo_id.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.fecha_hora}>
              <FormLabel>Fecha y Hora</FormLabel>
              <Controller
                name="fecha_hora"
                control={control}
                rules={{ required: 'Debe seleccionar una fecha y hora' }}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    {...field}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid',
                      borderColor: errors.fecha_hora ? 'red.500' : 'inherit',
                    }}
                  />
                )}
              />
              <FormErrorMessage>
                {errors.fecha_hora && errors.fecha_hora.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.servicios_ids}>
              <FormLabel>Servicios</FormLabel>
              <Controller
                name="servicios_ids"
                control={control}
                rules={{ required: 'Debe seleccionar al menos un servicio' }}
                render={({ field: { onChange, value } }) => (
                  <Stack spacing={2}>
                    {servicios?.map((servicio) => (
                      <Checkbox
                        key={servicio.id}
                        isChecked={value?.includes(servicio.id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(value || []), servicio.id]
                            : (value || []).filter((id) => id !== servicio.id);
                          onChange(newValue);
                        }}
                      >
                        <VStack align="start" spacing={0}>
                          <Text>{servicio.nombre}</Text>
                          <Text fontSize="sm" color="gray.600">
                            Precio: ${servicio.precio} - Duración: {servicio.duracion} min
                          </Text>
                        </VStack>
                      </Checkbox>
                    ))}
                  </Stack>
                )}
              />
              <FormErrorMessage>
                {errors.servicios_ids && errors.servicios_ids.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Notas adicionales</FormLabel>
              <Controller
                name="notas_cliente"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Describa cualquier detalle adicional sobre el servicio que necesita"
                  />
                )}
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting}
              type="submit"
              width="full"
            >
              Agendar Cita
            </Button>
          </Stack>
        </form>
      </VStack>
    </Container>
  );
};

export default NuevaCita; 