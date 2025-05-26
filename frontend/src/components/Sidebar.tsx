import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box,
    Flex,
    Icon,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiHome, FiUsers, FiSettings, FiCalendar, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface NavItemProps {
    icon: any;
    children: string;
    to: string;
}

const NavItem = ({ icon, children, to }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('brand.50', 'brand.900');
    const inactiveBg = useColorModeValue('transparent', 'transparent');
    const activeColor = useColorModeValue('brand.700', 'brand.100');
    const inactiveColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Link
            as={RouterLink}
            to={to}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? activeBg : inactiveBg}
                color={isActive ? activeColor : inactiveColor}
                _hover={{
                    bg: activeBg,
                    color: activeColor,
                }}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const Sidebar = () => {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'admin';

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            display={{ base: 'none', md: 'block' }}
        >
            <Stack spacing={0} py={5}>
                {isAdmin ? (
                    <>
                        <NavItem icon={FiHome} to="/dashboard">
                            Dashboard
                        </NavItem>
                        <NavItem icon={FiUsers} to="/usuarios">
                            Usuarios
                        </NavItem>
                        <NavItem icon={FiSettings} to="/servicios">
                            Servicios
                        </NavItem>
                    </>
                ) : (
                    <>
                        <NavItem icon={FiCalendar} to="/mis-citas">
                            Mis Citas
                        </NavItem>
                        <NavItem icon={FiCalendar} to="/nueva-cita">
                            Nueva Cita
                        </NavItem>
                        <NavItem icon={FiUser} to="/mi-perfil">
                            Mi Perfil
                        </NavItem>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default Sidebar; 