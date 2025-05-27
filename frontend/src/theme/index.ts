import { extendTheme } from '@chakra-ui/react';

const colors = {
    amacars: {
        // Colores principales del logo
        primary: {
            50: '#e6f2ff',
            100: '#b3d9ff',
            200: '#80bfff',
            300: '#4da6ff',
            400: '#1a8cff',
            500: '#0073e6',
            600: '#005cb3',
            700: '#004480',
            800: '#002d4d',
            900: '#00161a',
        },
        // Color secundario/acento
        secondary: {
            50: '#fff5e6',
            100: '#ffe0b3',
            200: '#ffcc80',
            300: '#ffb84d',
            400: '#ffa31a',
            500: '#e68a00',
            600: '#b36b00',
            700: '#804c00',
            800: '#4d2e00',
            900: '#1a0f00',
        },
    },
};

const fonts = {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
};

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
            borderRadius: 'md',
        },
        variants: {
            solid: (props: { colorScheme: string }) => ({
                bg: props.colorScheme === 'amacars.primary' ? 'amacars.primary.500' : undefined,
                color: 'white',
                _hover: {
                    bg: props.colorScheme === 'amacars.primary' ? 'amacars.primary.600' : undefined,
                },
            }),
            outline: (props: { colorScheme: string }) => ({
                borderColor: props.colorScheme === 'amacars.primary' ? 'amacars.primary.500' : undefined,
                color: props.colorScheme === 'amacars.primary' ? 'amacars.primary.500' : undefined,
                _hover: {
                    bg: props.colorScheme === 'amacars.primary' ? 'amacars.primary.50' : undefined,
                },
            }),
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
    Heading: {
        baseStyle: {
            color: 'amacars.primary.600'
        }
    },
    Icon: {
        baseStyle: {
            color: 'amacars.primary.500'
        }
    }
};

const styles = {
    global: {
        body: {
            bg: 'gray.50',
            color: 'gray.800'
        },
    },
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