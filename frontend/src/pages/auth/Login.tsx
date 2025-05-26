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
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../api/services';

interface LoginForm {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await authService.login(data.email, data.password);
            
            // Guardar el token
            localStorage.setItem('token', response.access_token);
            
            toast({
                title: 'Inicio de sesión exitoso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            // Redirigir según el rol del usuario
            if (response.user.rol === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/mis-citas');
            }
        } catch (error: any) {
            toast({
                title: 'Error al iniciar sesión',
                description: 'Credenciales inválidas',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
                Iniciar Sesión
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            {...register('email', {
                                required: 'Este campo es requerido',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email inválido',
                                },
                            })}
                        />
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Contraseña</FormLabel>
                        <Input
                            type="password"
                            {...register('password', {
                                required: 'Este campo es requerido',
                                minLength: {
                                    value: 6,
                                    message: 'La contraseña debe tener al menos 6 caracteres',
                                },
                            })}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        isLoading={isSubmitting}
                    >
                        Iniciar Sesión
                    </Button>

                    <Text textAlign="center">
                        ¿No tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/register" color="blue.500">
                            Regístrate aquí
                        </Link>
                    </Text>
                </Stack>
            </form>
        </Box>
    );
};

export default Login; 