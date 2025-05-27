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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { register as registerUser } from '../../api/auth';

const schema = yup.object().shape({
    nombre_completo: yup.string().required('El nombre completo es requerido'),
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
        .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .required('La contraseña es requerida'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
    telefono: yup.string().optional(),
    direccion: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

const Register = () => {
    const navigate = useNavigate();
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
            const { confirmPassword, ...registerData } = data;
            await registerUser(registerData);
            toast({
                title: 'Registro exitoso',
                description: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                title: 'Error en el registro',
                description: error.response?.data?.detail || 'Ocurrió un error al registrar la cuenta',
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
                    Registro
                </Heading>

                <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.nombre_completo}>
                            <FormLabel>Nombre Completo</FormLabel>
                            <Input
                                {...register('nombre_completo')}
                                placeholder="Ingresa tu nombre completo"
                            />
                            <FormErrorMessage>
                                {errors.nombre_completo?.message}
                            </FormErrorMessage>
                        </FormControl>

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

                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <Input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="Confirma tu contraseña"
                            />
                            <FormErrorMessage>
                                {errors.confirmPassword?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.telefono}>
                            <FormLabel>Teléfono (opcional)</FormLabel>
                            <Input
                                {...register('telefono')}
                                placeholder="Ingresa tu teléfono"
                            />
                            <FormErrorMessage>
                                {errors.telefono?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.direccion}>
                            <FormLabel>Dirección (opcional)</FormLabel>
                            <Input
                                {...register('direccion')}
                                placeholder="Ingresa tu dirección"
                            />
                            <FormErrorMessage>
                                {errors.direccion?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Registrarse
                        </Button>
                    </VStack>
                </Box>

                <Text textAlign="center">
                    ¿Ya tienes una cuenta?{' '}
                    <ChakraLink as={RouterLink} to="/login" color="blue.500">
                        Inicia sesión
                    </ChakraLink>
                </Text>
            </VStack>
        </Box>
    );
};

export default Register; 