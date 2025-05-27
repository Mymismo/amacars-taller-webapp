import React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { registrarVehiculo, VehiculoInput } from '../../api/vehiculos';

const NuevoVehiculo = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [formData, setFormData] = React.useState<Omit<VehiculoInput, 'cliente_id'>>({
        marca: '',
        modelo: '',
        anio: '',
        matricula: '',
        kilometraje: '',
        color: '',
        tipo: '',
    });

    const registrarVehiculoMutation = useMutation({
        mutationFn: (datos: VehiculoInput) => registrarVehiculo(datos),
        onSuccess: () => {
            toast({
                title: 'Vehículo registrado',
                description: 'El vehículo ha sido registrado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/mis-vehiculos');
        },
        onError: (error: any) => {
            toast({
                title: 'Error al registrar el vehículo',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            toast({
                title: 'Error de autenticación',
                description: 'No se pudo identificar al usuario',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        
        registrarVehiculoMutation.mutate({
            ...formData,
            cliente_id: user.id
        });
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Registrar Nuevo Vehículo</Heading>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Marca</FormLabel>
                            <Input
                                name="marca"
                                value={formData.marca}
                                onChange={handleInputChange}
                                placeholder="Ej: Toyota"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Modelo</FormLabel>
                            <Input
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleInputChange}
                                placeholder="Ej: Corolla"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Año</FormLabel>
                            <Input
                                name="anio"
                                type="number"
                                value={formData.anio}
                                onChange={handleInputChange}
                                placeholder="Ej: 2020"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Matrícula</FormLabel>
                            <Input
                                name="matricula"
                                value={formData.matricula}
                                onChange={handleInputChange}
                                placeholder="Ej: ABC-123"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Kilometraje</FormLabel>
                            <Input
                                name="kilometraje"
                                type="number"
                                value={formData.kilometraje}
                                onChange={handleInputChange}
                                placeholder="Ej: 50000"
                                min="0"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Color</FormLabel>
                            <Input
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                placeholder="Ej: Rojo"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Tipo de Vehículo</FormLabel>
                            <Input
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                                placeholder="Ej: Sedán"
                            />
                        </FormControl>

                        <Button
                            mt={4}
                            colorScheme="blue"
                            type="submit"
                            width="full"
                            isLoading={registrarVehiculoMutation.isPending}
                        >
                            Registrar Vehículo
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default NuevoVehiculo; 