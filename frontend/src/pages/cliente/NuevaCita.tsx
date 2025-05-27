import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    Heading,
    useToast,
    Text,
    Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NuevaCita = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        vehiculo_id: '',
        servicio_id: '',
        notas: '',
    });

    // TODO: Implementar la obtención de vehículos y servicios desde el backend
    const vehiculos = [];
    const servicios = [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: Implementar la creación de la cita en el backend
            toast({
                title: "Cita solicitada con éxito",
                description: "Te notificaremos cuando sea confirmada",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate('/mis-citas');
        } catch (error) {
            toast({
                title: "Error al solicitar la cita",
                description: "Por favor, inténtalo de nuevo",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Solicitar Nueva Cita</Heading>

                {vehiculos.length === 0 ? (
                    <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.600">
                            Primero necesitas registrar un vehículo
                        </Text>
                        <Button
                            mt={4}
                            colorScheme="blue"
                            onClick={() => navigate('/mis-vehiculos/nuevo')}
                        >
                            Registrar Vehículo
                        </Button>
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Vehículo</FormLabel>
                                <Select
                                    name="vehiculo_id"
                                    value={formData.vehiculo_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecciona un vehículo</option>
                                    {vehiculos.map((vehiculo) => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {`${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.matricula}`}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Servicio</FormLabel>
                                <Select
                                    name="servicio_id"
                                    value={formData.servicio_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecciona un servicio</option>
                                    {servicios.map((servicio) => (
                                        <option key={servicio.id} value={servicio.id}>
                                            {servicio.nombre}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Fecha</FormLabel>
                                <Input
                                    name="fecha"
                                    type="date"
                                    value={formData.fecha}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Hora</FormLabel>
                                <Input
                                    name="hora"
                                    type="time"
                                    value={formData.hora}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Notas adicionales</FormLabel>
                                <Input
                                    name="notas"
                                    value={formData.notas}
                                    onChange={handleInputChange}
                                    placeholder="Describe brevemente el problema o servicio que necesitas"
                                />
                            </FormControl>

                            <Button
                                mt={4}
                                colorScheme="blue"
                                type="submit"
                                width="full"
                            >
                                Solicitar Cita
                            </Button>
                        </VStack>
                    </form>
                )}
            </VStack>
        </Container>
    );
};

export default NuevaCita; 