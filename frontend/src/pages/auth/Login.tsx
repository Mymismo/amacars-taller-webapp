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
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/config';

interface LoginForm {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            const formData = new FormData();
            formData.append('username', data.email);
            formData.append('password', data.password);
            
            const response = await api.post('/auth/login', formData);
            const { access_token, user } = response.data;
            
            localStorage.setItem('token', access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            toast({
                title: 'Inicio de sesión exitoso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            // Redirigir según el rol del usuario
            if (user.rol === 'ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/mis-citas');
            }
        } catch (error) {
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
                        colorScheme="brand"
                        size="lg"
                        fontSize="md"
                        isLoading={isSubmitting}
                    >
                        Iniciar Sesión
                    </Button>

                    <Text textAlign="center">
                        ¿No tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/register" color="brand.500">
                            Regístrate aquí
                        </Link>
                    </Text>
                </Stack>
            </form>
        </Box>
    );
};

export default Login; 