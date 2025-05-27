import React from 'react';
import { 
    Box, 
    Container, 
    Stack, 
    Text, 
    Link, 
    useColorModeValue,
    Image,
    VStack,
    HStack,
    Icon,
    Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const SocialButton = ({ icon, href }: { icon: React.ElementType; href: string }) => {
    return (
        <Link
            href={href}
            isExternal
            _hover={{ transform: 'translateY(-2px)' }}
            transition="all 0.2s"
        >
            <Icon
                as={icon}
                w={6}
                h={6}
                color="amacars.primary.500"
                _hover={{ color: 'amacars.secondary.500' }}
                transition="all 0.2s"
            />
        </Link>
    );
};

const Footer = () => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const linkHoverColor = useColorModeValue('amacars.primary.600', 'amacars.primary.300');

    return (
        <Box
            bg={bg}
            color={textColor}
            borderTop="1px"
            borderColor={borderColor}
            shadow="sm"
        >
            <Container maxW="container.xl" py={10}>
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    spacing={{ base: 8, md: 10 }}
                    justify="space-between"
                    align={{ base: 'start', lg: 'center' }}
                >
                    <VStack align="start" spacing={4}>
                        <Link as={RouterLink} to="/">
                            <Image
                                src="/logo.png"
                                alt="AMACARS Logo"
                                h="50px"
                                mb={2}
                                _hover={{ transform: 'scale(1.05)' }}
                                transition="all 0.2s"
                            />
                        </Link>
                        <Text fontSize="sm" maxW="300px">
                            Tu taller de confianza para el mantenimiento y reparación de vehículos. Servicio profesional y atención personalizada.
                        </Text>
                    </VStack>

                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={{ base: 6, md: 12 }}
                    >
                        <VStack align="start" spacing={3}>
                            <Text fontWeight="bold" fontSize="lg" mb={2} color="amacars.primary.500">Enlaces</Text>
                            <Link 
                                as={RouterLink} 
                                to="/sobre-nosotros"
                                _hover={{ 
                                    color: linkHoverColor, 
                                    transform: 'translateX(2px)',
                                    textDecoration: 'none'
                                }}
                                transition="all 0.2s"
                            >
                                Sobre Nosotros
                            </Link>
                            <Link 
                                as={RouterLink} 
                                to="/consejos"
                                _hover={{ 
                                    color: linkHoverColor, 
                                    transform: 'translateX(2px)',
                                    textDecoration: 'none'
                                }}
                                transition="all 0.2s"
                            >
                                Consejos
                            </Link>
                            <Link 
                                as={RouterLink} 
                                to="/novedades"
                                _hover={{ 
                                    color: linkHoverColor, 
                                    transform: 'translateX(2px)',
                                    textDecoration: 'none'
                                }}
                                transition="all 0.2s"
                            >
                                Novedades
                            </Link>
                        </VStack>

                        <VStack align="start" spacing={3}>
                            <Text fontWeight="bold" fontSize="lg" mb={2} color="amacars.primary.500">Contacto</Text>
                            <HStack spacing={2}>
                                <Icon as={FaPhone} color="amacars.primary.500" />
                                <Link 
                                    href="tel:+34900000000"
                                    _hover={{ 
                                        color: linkHoverColor,
                                        textDecoration: 'none'
                                    }}
                                >
                                    900 000 000
                                </Link>
                            </HStack>
                            <HStack spacing={2}>
                                <Icon as={FaEnvelope} color="amacars.primary.500" />
                                <Link 
                                    href="mailto:info@amacars.com"
                                    _hover={{ 
                                        color: linkHoverColor,
                                        textDecoration: 'none'
                                    }}
                                >
                                    info@amacars.com
                                </Link>
                            </HStack>
                            <HStack spacing={2}>
                                <Icon as={FaMapMarkerAlt} color="amacars.primary.500" />
                                <Text fontSize="sm">Calle Principal 123, Madrid</Text>
                            </HStack>
                        </VStack>
                    </Stack>
                </Stack>

                <Divider my={8} borderColor={borderColor} />

                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    spacing={4}
                >
                    <Text fontSize="sm">
                        © {new Date().getFullYear()} AMACARS. Todos los derechos reservados
                    </Text>
                    <HStack spacing={4}>
                        <SocialButton icon={FaFacebook} href="https://facebook.com" />
                        <SocialButton icon={FaTwitter} href="https://twitter.com" />
                        <SocialButton icon={FaInstagram} href="https://instagram.com" />
                    </HStack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer; 