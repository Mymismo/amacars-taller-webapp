import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const Links = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '/contacto' },
];

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
    <Link
        as={RouterLink}
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        to={to}
    >
        {children}
    </Link>
);

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <Box bg={useColorModeValue('white', 'gray.900')} px={4} boxShadow="sm">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />

                <HStack spacing={8} alignItems={'center'}>
                    <Box>
                        <Image
                            src="/AMACARS_Logo.png"
                            alt="AMACARS Logo"
                            h="40px"
                            objectFit="contain"
                        />
                    </Box>
                    <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                        {Links.map((link) => (
                            <NavLink key={link.path} to={link.path}>
                                {link.name}
                            </NavLink>
                        ))}
                    </HStack>
                </HStack>

                <Flex alignItems={'center'}>
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                {user?.nombre}
                            </MenuButton>
                            <MenuList>
                                <MenuItem as={RouterLink} to="/mi-perfil">
                                    Mi Perfil
                                </MenuItem>
                                {user?.rol === 'admin' && (
                                    <MenuItem as={RouterLink} to="/dashboard">
                                        Dashboard
                                    </MenuItem>
                                )}
                                <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Button as={RouterLink} to="/login">
                            Iniciar Sesión
                        </Button>
                    )}
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {Links.map((link) => (
                            <NavLink key={link.path} to={link.path}>
                                {link.name}
                            </NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
};

export default Navbar; 