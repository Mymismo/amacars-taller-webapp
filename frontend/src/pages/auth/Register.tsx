import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    useToast,
    Link,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../api/config';

interface RegisterForm {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
    telefono: string;
}

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterForm>();
    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        try {
            await api.post('/auth/registro', {
                nombre: data.nombre,
                email: data.email,
                password: data.password,
                telefono: data.telefono,
                apellidos: '', // Campo requerido por el backend
                direccion: '', // Campo requerido por el backend
                rol: 'CLIENTE', // Por defecto para nuevos registros
            });
            
            toast({
                title: 'Registro exitoso',
                description: 'Ya puedes iniciar sesión',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            navigate('/login');
        } catch (error: any) {
            toast({
                title: 'Error al registrarse',
                description: error.response?.data?.detail || 'Por favor, intenta nuevamente',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={8} maxWidth="500px" mx="auto">
            <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
                Registro
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.nombre}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            {...register('nombre', {
                                required: 'El nombre es requerido',
                                minLength: {
                                    value: 2,
                                    message: 'El nombre debe tener al menos 2 caracteres',
                                },
                            })}
                        />
                        <FormErrorMessage>
                            {errors.nombre && errors.nombre.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            {...register('email', {
                                required: 'El email es requerido',
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

                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Contraseña</FormLabel>
                        <Input
                            type="password"
                            {...register('password', {
                                required: 'La contraseña es requerida',
                                minLength: {
                                    value: 6,
                                    message: 'La contraseña debe tener al menos 6 caracteres',
                                },
                            })}
                        />
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <Input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Debes confirmar la contraseña',
                                validate: (val: string) => {
                                    if (watch('password') != val) {
                                        return "Las contraseñas no coinciden";
                                    }
                                }
                            })}
                        />
                        <FormErrorMessage>
                            {errors.confirmPassword && errors.confirmPassword.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.telefono}>
                        <FormLabel>Teléfono</FormLabel>
                        <Input
                            type="tel"
                            {...register('telefono', {
                                required: 'El teléfono es requerido',
                                pattern: {
                                    value: /^[0-9]{9}$/,
                                    message: 'El teléfono debe tener 9 dígitos',
                                },
                            })}
                        />
                        <FormErrorMessage>
                            {errors.telefono && errors.telefono.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="brand"
                        size="lg"
                        fontSize="md"
                        isLoading={isSubmitting}
                        w="100%"
                    >
                        Registrarse
                    </Button>

                    <Text textAlign="center">
                        ¿Ya tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/login" color="brand.500">
                            Inicia sesión aquí
                        </Link>
                    </Text>
                </Stack>
            </form>
        </Box>
    );
};

export default Register; 