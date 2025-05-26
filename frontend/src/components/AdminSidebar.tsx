import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box,
    VStack,
    Link,
    Icon,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    FiHome,
    FiUsers,
    FiTool,
    FiCalendar,
    FiBell,
    FiFileText,
} from 'react-icons/fi';
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
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Link
            as={RouterLink}
            to={to}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Box
                display="flex"
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? activeBg : 'transparent'}
                _hover={{
                    bg: hoverBg,
                }}
            >
                <Icon
                    mr="4"
                    fontSize="16"
                    as={icon}
                    color={isActive ? 'brand.500' : 'gray.500'}
                />
                <Text color={isActive ? 'brand.500' : 'gray.500'}>{children}</Text>
            </Box>
        </Link>
    );
};

const AdminSidebar = () => {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'ADMIN';

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
            <VStack align="stretch" spacing={1} pt={5}>
                <NavItem icon={FiHome} to="/admin">
                    Dashboard
                </NavItem>
                {isAdmin && (
                    <NavItem icon={FiUsers} to="/admin/usuarios">
                        Usuarios
                    </NavItem>
                )}
                {isAdmin && (
                    <NavItem icon={FiTool} to="/admin/servicios">
                        Servicios
                    </NavItem>
                )}
                <NavItem icon={FiCalendar} to="/admin/citas">
                    Citas
                </NavItem>
                {isAdmin && (
                    <NavItem icon={FiBell} to="/admin/notificaciones">
                        Notificaciones
                    </NavItem>
                )}
                <NavItem icon={FiFileText} to="/admin/presupuestos">
                    Presupuestos
                </NavItem>
            </VStack>
        </Box>
    );
};

export default AdminSidebar; 