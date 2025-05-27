import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
    Avatar,
    Text,
    Container,
    Divider,
    Icon,
    Tooltip,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

interface NavLinkProps {
    children: React.ReactNode;
    to: string;
    isActive?: boolean;
}

const NavLink = ({ children, to, isActive }: NavLinkProps) => (
    <Link
        as={RouterLink}
        px={3}
        py={2}
        rounded={'md'}
        color={isActive ? 'amacars.primary.500' : useColorModeValue('gray.600', 'gray.200')}
        fontWeight={isActive ? 'semibold' : 'medium'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('amacars.primary.50', 'amacars.primary.900'),
            color: useColorModeValue('amacars.primary.600', 'amacars.primary.200'),
        }}
        transition="all 0.2s"
        to={to}
    >
        {children}
    </Link>
);

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = async () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const getNavLinks = () => {
        const commonLinks = [
            { text: 'Inicio', path: '/' }
        ];

        switch (user?.rol) {
            case 'ADMIN':
                return [
                    ...commonLinks,
                    { text: 'Dashboard', path: '/dashboard' },
                    { text: 'Usuarios', path: '/usuarios' },
                    { text: 'Servicios', path: '/servicios' },
                    { text: 'Citas', path: '/citas' }
                ];
            case 'MECANICO':
                return [
                    ...commonLinks,
                    { text: 'Mis Citas Asignadas', path: '/citas-asignadas' },
                    { text: 'Historial de Servicios', path: '/historial-servicios' }
                ];
            case 'RECEPCIONISTA':
                return [
                    ...commonLinks,
                    { text: 'Gestión de Citas', path: '/citas' },
                    { text: 'Clientes', path: '/clientes' }
                ];
            case 'CLIENTE':
                return [
                    ...commonLinks,
                    { text: 'Mis Citas', path: '/mis-citas' },
                    { text: 'Nueva Cita', path: '/nueva-cita' },
                    { text: 'Mis Vehículos', path: '/mis-vehiculos' }
                ];
            default:
                return commonLinks;
        }
    };

    const navLinks = getNavLinks();

    return (
        <Box 
            bg={bg} 
            borderBottom="1px" 
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="sticky"
            shadow="sm"
        >
            <Container maxW="container.xl">
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                        variant="ghost"
                        color="amacars.primary.500"
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link as={RouterLink} to="/">
                                <Image
                                    src="/logo.png"
                                    alt="AMACARS Logo"
                                    h="40px"
                                    _hover={{ transform: 'scale(1.05)' }}
                                    transition="all 0.2s"
                                />
                            </Link>
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={1}
                            display={{ base: 'none', md: 'flex' }}>
                            {navLinks.map((link) => (
                                <NavLink 
                                    key={link.path} 
                                    to={link.path}
                                    isActive={location.pathname === link.path}
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        {user ? (
                            <HStack spacing={3}>
                                <Menu>
                                    <Tooltip label="Menú de usuario">
                                        <MenuButton
                                            as={Button}
                                            variant="ghost"
                                            rightIcon={<ChevronDownIcon />}
                                            _hover={{ bg: useColorModeValue('amacars.primary.50', 'amacars.primary.900') }}
                                        >
                                            <HStack>
                                                <Avatar
                                                    size={'sm'}
                                                    name={`${user.nombre} ${user.apellidos}`}
                                                    bg="amacars.primary.500"
                                                    color="white"
                                                />
                                                <Text display={{ base: 'none', md: 'block' }}>
                                                    {user.nombre}
                                                </Text>
                                            </HStack>
                                        </MenuButton>
                                    </Tooltip>
                                    <MenuList
                                        borderColor={borderColor}
                                        shadow="lg"
                                    >
                                        <MenuItem 
                                            as={RouterLink} 
                                            to="/mi-perfil"
                                            _hover={{ bg: useColorModeValue('amacars.primary.50', 'amacars.primary.900') }}
                                            icon={<Icon as={FaUser} color="amacars.primary.500" />}
                                        >
                                            Mi Perfil
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem 
                                            onClick={handleLogout}
                                            color="red.500"
                                            _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                                            icon={<Icon as={FaSignOutAlt} color="red.500" />}
                                        >
                                            Cerrar Sesión
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                                <Button
                                    leftIcon={<Icon as={FaSignOutAlt} />}
                                    onClick={handleLogout}
                                    colorScheme="red"
                                    variant="solid"
                                    size="md"
                                    display={{ base: 'none', md: 'flex' }}
                                    _hover={{
                                        bg: 'red.600',
                                        transform: 'translateY(-1px)',
                                        shadow: 'md',
                                    }}
                                >
                                    Cerrar Sesión
                                </Button>
                            </HStack>
                        ) : (
                            <Button
                                as={RouterLink}
                                to="/login"
                                colorScheme="amacars.primary"
                                size={'md'}
                                fontWeight="semibold"
                                px={6}
                                _hover={{
                                    transform: 'translateY(-1px)',
                                    shadow: 'md',
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={1}>
                            {navLinks.map((link) => (
                                <NavLink 
                                    key={link.path} 
                                    to={link.path}
                                    isActive={location.pathname === link.path}
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                            {user && (
                                <Button
                                    leftIcon={<Icon as={FaSignOutAlt} />}
                                    onClick={handleLogout}
                                    colorScheme="red"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    width="100%"
                                    px={3}
                                >
                                    Cerrar Sesión
                                </Button>
                            )}
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    );
};

export default Navbar; 