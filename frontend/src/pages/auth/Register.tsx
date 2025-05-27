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
    InputGroup,
    InputRightElement,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { register as registerUser } from '../../api/auth';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const schema = yup.object().shape({
    nombre_completo: yup.string()
        .required('El nombre completo es requerido')
        .min(3, 'El nombre completo debe tener al menos 3 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    email: yup.string()
        .email('Email inválido')
        .required('El email es requerido')
        .matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            'Formato de email inválido'
        ),
    password: yup.string()
        .required('La contraseña es requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
        .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .matches(/[!@#$%^&*]/, 'La contraseña debe contener al menos un carácter especial'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
    telefono: yup.string()
        .required('El teléfono es requerido')
        .matches(/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos'),
    direccion: yup.string()
        .required('La dirección es requerida')
        .min(5, 'La dirección debe tener al menos 5 caracteres'),
});

type FormData = yup.InferType<typeof schema>;

const Register = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
                description: 'Tu cuenta ha sido creada. Por favor, revisa tu email para confirmar tu cuenta.',
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
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <VStack spacing={8} align="stretch">
                <Heading size="xl" textAlign="center">
                    Registro de Cliente
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
                            <InputGroup>
                                <Input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingresa tu contraseña"
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="sm"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.password?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirma tu contraseña"
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        variant="ghost"
                                        size="sm"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.confirmPassword?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.telefono}>
                            <FormLabel>Teléfono</FormLabel>
                            <Input
                                {...register('telefono')}
                                placeholder="Ingresa tu teléfono (9 dígitos)"
                                maxLength={9}
                            />
                            <FormErrorMessage>
                                {errors.telefono?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.direccion}>
                            <FormLabel>Dirección</FormLabel>
                            <Input
                                {...register('direccion')}
                                placeholder="Ingresa tu dirección completa"
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
                            mt={4}
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