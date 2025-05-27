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
import { FiHome, FiUsers, FiSettings, FiCalendar, FiUser, FiTruck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface NavItemProps {
    icon: any;
    children: string;
    to: string;
}

const NavItem = ({ icon, children, to }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('amacars.primary.50', 'amacars.primary.900');
    const inactiveBg = useColorModeValue('transparent', 'transparent');
    const activeColor = useColorModeValue('amacars.primary.700', 'amacars.primary.200');
    const inactiveColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Link
            as={RouterLink}
            to={to}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            w="full"
        >
            <Flex
                align="center"
                p="3"
                mx="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? activeBg : inactiveBg}
                color={isActive ? activeColor : inactiveColor}
                _hover={{
                    bg: activeBg,
                    color: activeColor,
                }}
                transition="all 0.2s"
            >
                {icon && (
                    <Icon
                        mr="3"
                        fontSize="16"
                        as={icon}
                    />
                )}
                <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"}>
                    {children}
                </Text>
            </Flex>
        </Link>
    );
};

const Sidebar = () => {
    const { user } = useAuth();
    
    const renderNavItems = () => {
        switch (user?.rol) {
            case 'ADMIN':
                return (
                    <>
                        <NavItem icon={FiHome} to="/dashboard">Dashboard</NavItem>
                        <NavItem icon={FiUsers} to="/usuarios">Usuarios</NavItem>
                        <NavItem icon={FiSettings} to="/servicios">Servicios</NavItem>
                        <NavItem icon={FiCalendar} to="/citas">Todas las Citas</NavItem>
                    </>
                );
            case 'CLIENTE':
                return (
                    <>
                        <NavItem icon={FiCalendar} to="/mis-citas">Mis Citas</NavItem>
                        <NavItem icon={FiCalendar} to="/nueva-cita">Nueva Cita</NavItem>
                        <NavItem icon={FiTruck} to="/mis-vehiculos">Mis Vehículos</NavItem>
                        <NavItem icon={FiUser} to="/mi-perfil">Mi Perfil</NavItem>
                    </>
                );
            case 'MECANICO':
                return (
                    <>
                        <NavItem icon={FiCalendar} to="/mis-servicios">Mis Servicios</NavItem>
                        <NavItem icon={FiUser} to="/mi-perfil">Mi Perfil</NavItem>
                    </>
                );
            case 'RECEPCIONISTA':
                return (
                    <>
                        <NavItem icon={FiCalendar} to="/citas">Gestionar Citas</NavItem>
                        <NavItem icon={FiUsers} to="/clientes">Clientes</NavItem>
                        <NavItem icon={FiUser} to="/mi-perfil">Mi Perfil</NavItem>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w="full"
            h="full"
            py={2}
        >
            <Stack spacing={1}>
                {renderNavItems()}
            </Stack>
        </Box>
    );
};

export default Sidebar; 