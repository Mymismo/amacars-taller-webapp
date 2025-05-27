import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Icon,
    VStack,
    HStack,
    Image,
    useColorModeValue,
    Stack,
    createIcon,
    Flex,
} from '@chakra-ui/react';
import { FiClock, FiTool, FiThumbsUp, FiShield } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Arrow = createIcon({
    displayName: 'Arrow',
    viewBox: '0 0 72 24',
    path: (
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
            fill="currentColor"
        />
    ),
});

const Feature = ({ icon, title, text }: { icon: any; title: string; text: string }) => {
    const bgBox = useColorModeValue('white', 'gray.800');
    const iconColor = useColorModeValue('amacars.primary.500', 'amacars.primary.300');
    const hoverBg = useColorModeValue('amacars.primary.50', 'amacars.primary.900');
    
    return (
        <VStack
            align="start"
            p={8}
            bg={bgBox}
            borderRadius="xl"
            boxShadow="xl"
            spacing={4}
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '2xl',
                bg: hoverBg,
            }}
        >
            <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={iconColor}
                rounded={'full'}
                bg={useColorModeValue('amacars.primary.50', 'amacars.primary.900')}
                mb={2}
            >
                <Icon as={icon} w={8} h={8} />
            </Flex>
            <Heading size="md" fontWeight="700">{title}</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>{text}</Text>
        </VStack>
    );
};

const Home = () => {
    const { isAuthenticated } = useAuth();
    const bgGradient = useColorModeValue(
        'linear(to-r, amacars.primary.600, amacars.secondary.500)',
        'linear(to-r, amacars.primary.800, amacars.secondary.700)'
    );

    return (
        <>
            <Box 
                position="relative" 
                overflow="hidden"
                minH="90vh"
                display="flex"
                alignItems="center"
                bgGradient={useColorModeValue(
                    'linear(to-r, blue.50, amacars.primary.50)',
                    'linear(to-r, gray.900, amacars.primary.900)'
                )}
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgGradient: useColorModeValue(
                        'linear(45deg, transparent 0%, amacars.primary.50 100%)',
                        'linear(45deg, transparent 0%, amacars.primary.900 100%)'
                    ),
                    opacity: 0.8,
                    zIndex: 0,
                }}
            >
                <Container maxW={'7xl'} position="relative" zIndex={1}>
                    <Stack
                        as={Box}
                        textAlign={'center'}
                        spacing={{ base: 8, md: 14 }}
                        py={{ base: 20, md: 36 }}
                    >
                        <Heading
                            fontWeight={800}
                            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                            lineHeight={'110%'}
                        >
                            AMACARS <br />
                            <Text 
                                as={'span'} 
                                bgGradient={bgGradient} 
                                bgClip="text"
                                fontSize={{ base: '4xl', sm: '5xl', md: '7xl' }}
                            >
                                Tu Taller de Confianza
                            </Text>
                        </Heading>
                        <Text 
                            color={useColorModeValue('gray.600', 'gray.300')}
                            fontSize={{ base: 'lg', md: 'xl' }}
                            maxW={'3xl'}
                            mx="auto"
                        >
                            En AMACARS nos dedicamos a brindar el mejor servicio para tu vehículo.
                            Contamos con técnicos especializados y la última tecnología para
                            garantizar un trabajo de calidad.
                        </Text>
                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            spacing={4}
                            align={'center'}
                            alignSelf={'center'}
                            position={'relative'}
                        >
                            {!isAuthenticated ? (
                                <Button
                                    as={RouterLink}
                                    to="/login"
                                    colorScheme="amacars.primary"
                                    bg="amacars.primary.500"
                                    rounded={'full'}
                                    px={8}
                                    py={7}
                                    fontSize="lg"
                                    _hover={{
                                        bg: 'amacars.primary.600',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'xl',
                                    }}
                                >
                                    Iniciar Sesión
                                </Button>
                            ) : (
                                <Button
                                    as={RouterLink}
                                    to="/nueva-cita"
                                    colorScheme="amacars.primary"
                                    bg="amacars.primary.500"
                                    rounded={'full'}
                                    px={8}
                                    py={7}
                                    fontSize="lg"
                                    _hover={{
                                        bg: 'amacars.primary.600',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'xl',
                                    }}
                                >
                                    Agendar Cita
                                </Button>
                            )}
                            <Button
                                as={RouterLink}
                                to="/sobre-nosotros"
                                variant={'outline'}
                                colorScheme="amacars.primary"
                                rounded={'full'}
                                px={8}
                                py={7}
                                fontSize="lg"
                                _hover={{
                                    bg: 'amacars.primary.50',
                                    transform: 'translateY(-2px)',
                                }}
                            >
                                Conoce Más
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
                <Container maxW="container.xl">
                    <SimpleGrid 
                        columns={{ base: 1, md: 2, lg: 4 }} 
                        spacing={10}
                        px={{ base: 4, md: 8 }}
                    >
                        <Feature
                            icon={FiClock}
                            title="Servicio Rápido"
                            text="Optimizamos nuestros procesos para minimizar el tiempo de espera y maximizar la eficiencia."
                        />
                        <Feature
                            icon={FiTool}
                            title="Expertos Calificados"
                            text="Nuestro equipo de técnicos está altamente capacitado y certificado para todo tipo de reparaciones."
                        />
                        <Feature
                            icon={FiThumbsUp}
                            title="Calidad Garantizada"
                            text="Utilizamos repuestos originales y ofrecemos garantía en todos nuestros servicios."
                        />
                        <Feature
                            icon={FiShield}
                            title="Confianza Total"
                            text="Transparencia en nuestros procesos y presupuestos sin sorpresas."
                        />
                    </SimpleGrid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box 
                bg={useColorModeValue('white', 'gray.800')} 
                py={20}
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    bgGradient: useColorModeValue(
                        'linear(to-b, amacars.primary.50, transparent)',
                        'linear(to-b, gray.900, gray.800)'
                    ),
                }}
            >
                <Container maxW="container.xl" position="relative">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
                        <Box>
                            <Heading 
                                mb={4} 
                                bgGradient={bgGradient} 
                                bgClip="text"
                                fontSize={{ base: '3xl', md: '4xl' }}
                                fontWeight="800"
                            >
                                ¿Necesitas un Servicio?
                            </Heading>
                            <Text 
                                fontSize="xl" 
                                color={useColorModeValue('gray.600', 'gray.300')} 
                                mb={6}
                            >
                                Agenda una cita con nosotros y experimenta un servicio
                                profesional y personalizado para tu vehículo.
                            </Text>
                            {!isAuthenticated ? (
                                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                                    <Button
                                        as={RouterLink}
                                        to="/login"
                                        size="lg"
                                        colorScheme="amacars.primary"
                                        bg="amacars.primary.500"
                                        px={8}
                                        _hover={{
                                            bg: 'amacars.primary.600',
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'lg',
                                        }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button
                                        as={RouterLink}
                                        to="/register"
                                        size="lg"
                                        variant="outline"
                                        colorScheme="amacars.primary"
                                        px={8}
                                        _hover={{
                                            bg: 'amacars.primary.50',
                                            transform: 'translateY(-2px)',
                                        }}
                                    >
                                        Registrarse
                                    </Button>
                                </Stack>
                            ) : (
                                <Button
                                    as={RouterLink}
                                    to="/nueva-cita"
                                    size="lg"
                                    colorScheme="amacars.primary"
                                    px={8}
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'lg',
                                    }}
                                >
                                    Agendar Cita
                                </Button>
                            )}
                        </Box>
                        <Box 
                            bg={useColorModeValue('amacars.primary.50', 'amacars.primary.900')}
                            p={8}
                            borderRadius="xl"
                            boxShadow="2xl"
                            position="relative"
                            overflow="hidden"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgGradient: useColorModeValue(
                                    'linear(45deg, transparent 0%, amacars.secondary.50 100%)',
                                    'linear(45deg, transparent 0%, amacars.secondary.900 100%)'
                                ),
                                opacity: 0.3,
                            }}
                        >
                            <VStack spacing={4} position="relative" zIndex={1}>
                                <Icon 
                                    as={FiTool} 
                                    w={20} 
                                    h={20} 
                                    color={useColorModeValue('amacars.primary.500', 'amacars.primary.200')} 
                                />
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    textAlign="center"
                                    color={useColorModeValue('gray.700', 'white')}
                                >
                                    Servicio Profesional y Confiable
                                </Text>
                            </VStack>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>
        </>
    );
};

export default Home; 