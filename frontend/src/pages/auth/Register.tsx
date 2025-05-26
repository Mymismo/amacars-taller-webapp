import React, { useState } from 'react';
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
    InputGroup,
    InputRightElement,
    IconButton,
    Container,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../../api/services';

interface RegisterForm {
    nombre_completo: string;
    email: string;
    password: string;
    confirmPassword: string;
    telefono: string;
}

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        try {
            setIsLoading(true);
            
            // Validar formato del nombre
            const nombreLimpio = data.nombre_completo.trim().replace(/\s+/g, ' ');
            if (nombreLimpio.length < 3) {
                toast({
                    title: 'Error de validación',
                    description: 'El nombre completo debe tener al menos 3 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            await authService.register(data);
            toast({
                title: 'Registro exitoso',
                description: 'Tu cuenta ha sido creada correctamente',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                title: 'Error al registrarse',
                description: error.response?.data?.detail || error.message || 'Ocurrió un error durante el registro',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <Stack spacing={4}>
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        Crear Nueva Cuenta
                    </Text>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.nombre_completo}>
                                <FormLabel>Nombre completo</FormLabel>
                                <Input
                                    {...register('nombre_completo', {
                                        required: 'Este campo es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'El nombre debe tener al menos 3 caracteres'
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                            message: 'El nombre solo debe contener letras y espacios'
                                        }
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.nombre_completo && errors.nombre_completo.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel>Correo electrónico</FormLabel>
                                <Input
                                    type="email"
                                    {...register('email', {
                                        required: 'Este campo es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Dirección de correo inválida'
                                        }
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel>Contraseña</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', {
                                            required: 'Este campo es requerido',
                                            minLength: {
                                                value: 8,
                                                message: 'La contraseña debe tener al menos 8 caracteres'
                                            }
                                        })}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.confirmPassword}>
                                <FormLabel>Confirmar contraseña</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword', {
                                            required: 'Este campo es requerido',
                                            validate: (value) =>
                                                value === watch('password') || 'Las contraseñas no coinciden'
                                        })}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            variant="ghost"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.confirmPassword && errors.confirmPassword.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.telefono}>
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    type="tel"
                                    {...register('telefono', {
                                        required: 'Este campo es requerido',
                                        pattern: {
                                            value: /^[0-9]{9,10}$/,
                                            message: 'Número de teléfono inválido (9-10 dígitos)'
                                        }
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.telefono && errors.telefono.message}
                                </FormErrorMessage>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                size="lg"
                                fontSize="md"
                                isLoading={isLoading}
                            >
                                Crear cuenta
                            </Button>
                        </Stack>
                    </form>

                    <Text mt={4} textAlign="center">
                        ¿Ya tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/login" color="blue.500">
                            Inicia sesión aquí
                        </Link>
                    </Text>
                </Stack>
            </Box>
        </Container>
    );
};

export default Register; 