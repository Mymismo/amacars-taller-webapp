import React from 'react';
import {
    Box,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    HStack,
    VStack,
    useToast,
    Text,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cliente, ClienteInput } from '../../types/cliente';
import { getClientes, crearCliente, actualizarCliente, eliminarCliente } from '../../api/clientes';

const GestionClientes = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clienteSeleccionado, setClienteSeleccionado] = React.useState<Cliente | null>(null);
    const [formData, setFormData] = React.useState<ClienteInput>({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
    });

    const { data: clientes, isLoading } = useQuery({
        queryKey: ['clientes'],
        queryFn: getClientes,
        onError: (error: any) => {
            toast({
                title: 'Error al cargar los clientes',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const crearClienteMutation = useMutation({
        mutationFn: crearCliente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            toast({
                title: 'Cliente creado',
                description: 'El cliente ha sido creado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            onClose();
            resetForm();
        },
        onError: (error: any) => {
            toast({
                title: 'Error al crear el cliente',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const actualizarClienteMutation = useMutation({
        mutationFn: ({ id, cliente }: { id: string; cliente: ClienteInput }) =>
            actualizarCliente(id, cliente),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            toast({
                title: 'Cliente actualizado',
                description: 'El cliente ha sido actualizado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            onClose();
            resetForm();
        },
        onError: (error: any) => {
            toast({
                title: 'Error al actualizar el cliente',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const eliminarClienteMutation = useMutation({
        mutationFn: eliminarCliente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            toast({
                title: 'Cliente eliminado',
                description: 'El cliente ha sido eliminado exitosamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error al eliminar el cliente',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (clienteSeleccionado) {
            actualizarClienteMutation.mutate({
                id: clienteSeleccionado.id,
                cliente: formData
            });
        } else {
            crearClienteMutation.mutate(formData);
        }
    };

    const handleEditar = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setFormData({
            nombre: cliente.nombre,
            apellidos: cliente.apellidos,
            email: cliente.email,
            telefono: cliente.telefono,
            direccion: cliente.direccion || '',
        });
        onOpen();
    };

    const handleNuevoCliente = () => {
        setClienteSeleccionado(null);
        resetForm();
        onOpen();
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellidos: '',
            email: '',
            telefono: '',
            direccion: '',
        });
        setClienteSeleccionado(null);
    };

    if (isLoading) {
        return <Box>Cargando...</Box>;
    }

    return (
        <Container maxW="container.xl" py={5}>
            <VStack spacing={5}>
                <HStack width="100%" justify="space-between">
                    <Heading>Gestión de Clientes</Heading>
                    <Button colorScheme="blue" onClick={handleNuevoCliente}>
                        Nuevo Cliente
                    </Button>
                </HStack>

                {!clientes?.length ? (
                    <Text>No hay clientes registrados</Text>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Nombre</Th>
                                <Th>Email</Th>
                                <Th>Teléfono</Th>
                                <Th>Dirección</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {clientes.map((cliente) => (
                                <Tr key={cliente.id}>
                                    <Td>{`${cliente.nombre} ${cliente.apellidos}`}</Td>
                                    <Td>{cliente.email}</Td>
                                    <Td>{cliente.telefono}</Td>
                                    <Td>{cliente.direccion || '-'}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={() => handleEditar(cliente)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => eliminarClienteMutation.mutate(cliente.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader>
                                {clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel>Nombre</FormLabel>
                                        <Input
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Apellidos</FormLabel>
                                        <Input
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Teléfono</FormLabel>
                                        <Input
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Dirección</FormLabel>
                                        <Input
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleInputChange}
                                        />
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={crearClienteMutation.isPending || actualizarClienteMutation.isPending}
                                >
                                    {clienteSeleccionado ? 'Guardar Cambios' : 'Crear Cliente'}
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    );
};

export default GestionClientes; 