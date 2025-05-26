import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
            borderTop="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            <Container
                as={Stack}
                maxW="container.xl"
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <Text>© 2024 AMACARS. Todos los derechos reservados</Text>
                <Stack direction="row" spacing={6}>
                    <Link as={RouterLink} to="/sobre-nosotros">
                        Sobre Nosotros
                    </Link>
                    <Link as={RouterLink} to="/consejos">
                        Consejos
                    </Link>
                    <Link as={RouterLink} to="/novedades">
                        Novedades
                    </Link>
                    <Link href="mailto:info@amacars.com">
                        Contacto
                    </Link>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer; 