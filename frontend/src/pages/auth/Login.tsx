import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    Link as ChakraLink,
    useToast,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object().shape({
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup.string().required('La contraseña es requerida'),
});

type FormData = yup.InferType<typeof schema>;

const Login = () => {
    const { login } = useAuth();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await login(data.email, data.password);
        } catch (error: any) {
            toast({
                title: 'Error al iniciar sesión',
                description: error.response?.data?.detail || 'Credenciales inválidas',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <VStack spacing={8} align="stretch">
                <Heading size="xl" textAlign="center">
                    Iniciar Sesión
                </Heading>

                <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="Ingresa tu email"
                            />
                            <FormErrorMessage>
                                {errors.email?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="Ingresa tu contraseña"
                            />
                            <FormErrorMessage>
                                {errors.password?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Iniciar Sesión
                        </Button>
                    </VStack>
                </Box>

                <Text textAlign="center">
                    ¿No tienes una cuenta?{' '}
                    <ChakraLink as={RouterLink} to="/register" color="blue.500">
                        Regístrate
                    </ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default Login; 