import { extendTheme } from '@chakra-ui/react';

const colors = {
    amacars: {
        // Colores principales del logo
        primary: {
            50: '#E6F2FF',
            100: '#CCE5FF',
            200: '#99CCFF',
            300: '#66B2FF',
            400: '#3399FF',
            500: '#0080FF', // Color principal
            600: '#0066CC',
            700: '#004C99',
            800: '#003366',
            900: '#001933',
        },
        // Color secundario/acento
        secondary: {
            50: '#FFF5E6',
            100: '#FFEBCC',
            200: '#FFD699',
            300: '#FFC266',
            400: '#FFAD33',
            500: '#FF9900', // Color secundario
            600: '#CC7A00',
            700: '#995C00',
            800: '#663D00',
            900: '#331F00',
        },
    },
};

const fonts = {
    heading: '"Montserrat", sans-serif',
    body: '"Inter", sans-serif',
};

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
            borderRadius: 'md',
        },
        variants: {
            solid: {
                bg: 'amacars.primary.500',
                color: 'white',
                _hover: {
                    bg: 'amacars.primary.600',
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                },
                _active: {
                    bg: 'amacars.primary.700',
                    transform: 'translateY(0)',
                },
            },
            outline: {
                borderColor: 'amacars.primary.500',
                color: 'amacars.primary.500',
                _hover: {
                    bg: 'amacars.primary.50',
                },
            },
        },
        defaultProps: {
            colorScheme: 'amacars.primary',
        },
    },
    Link: {
        baseStyle: {
            _hover: {
                textDecoration: 'none',
            },
        },
    },
    Card: {
        baseStyle: {
            container: {
                borderRadius: 'xl',
                overflow: 'hidden',
                boxShadow: 'sm',
                transition: 'all 0.2s',
                _hover: {
                    shadow: 'md',
                },
            },
        },
    },
};

const styles = {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
        body: {
            bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
            color: props.colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900',
        },
    }),
};

const theme = extendTheme({
    colors,
    fonts,
    components,
    styles,
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
});

export default theme; 