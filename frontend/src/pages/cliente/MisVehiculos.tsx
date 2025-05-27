import React from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiTruck, FiCalendar, FiSettings } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const MisVehiculos = () => {
    // TODO: Implementar la lógica para obtener los vehículos del cliente
    const vehiculos = [
        {
            id: 1,
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2020,
            placa: 'ABC-123',
            ultimoServicio: '2024-01-15',
            proximoServicio: '2024-04-15',
        },
        {
            id: 2,
            marca: 'Honda',
            modelo: 'Civic',
            año: 2019,
            placa: 'XYZ-789',
            ultimoServicio: '2024-02-01',
            proximoServicio: '2024-05-01',
        }
    ];

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg" color="amacars.primary.600">
                        Mis Vehículos
                    </Heading>
                    <Button
                        as={RouterLink}
                        to="/mis-vehiculos/nuevo"
                        colorScheme="amacars.primary"
                        leftIcon={<Icon as={FiPlus} />}
                    >
                        Agregar Vehículo
                    </Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {vehiculos.map((vehiculo) => (
                        <Box
                            key={vehiculo.id}
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="md"
                            transition="all 0.3s"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        >
                            <VStack align="start" spacing={4}>
                                <HStack spacing={3}>
                                    <Icon 
                                        as={FiTruck} 
                                        w={6} 
                                        h={6} 
                                        color="amacars.primary.500" 
                                    />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="lg" fontWeight="bold">
                                            {vehiculo.marca} {vehiculo.modelo}
                                        </Text>
                                        <Text color="gray.500">
                                            {vehiculo.año} - {vehiculo.placa}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <VStack align="start" spacing={2} width="100%">
                                    <HStack>
                                        <Icon as={FiCalendar} color="amacars.primary.500" />
                                        <Text fontSize="sm">
                                            Último servicio: {vehiculo.ultimoServicio}
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={FiSettings} color="amacars.primary.500" />
                                        <Text fontSize="sm">
                                            Próximo servicio: {vehiculo.proximoServicio}
                                        </Text>
                                    </HStack>
                                </VStack>

                                <HStack spacing={3} width="100%">
                                    <Button
                                        as={RouterLink}
                                        to={`/nueva-cita?vehiculo=${vehiculo.id}`}
                                        colorScheme="amacars.primary"
                                        size="sm"
                                        flex={1}
                                    >
                                        Agendar Servicio
                                    </Button>
                                    <Button
                                        as={RouterLink}
                                        to={`/mis-vehiculos/editar/${vehiculo.id}`}
                                        variant="outline"
                                        colorScheme="amacars.primary"
                                        size="sm"
                                        flex={1}
                                    >
                                        Editar
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default MisVehiculos; 