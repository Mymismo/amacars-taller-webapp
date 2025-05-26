import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    fonts: {
        heading: `'Montserrat', sans-serif`,
        body: `'Open Sans', sans-serif`,
    },
    colors: {
        brand: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
        },
        Input: {
            variants: {
                filled: {
                    field: {
                        bg: 'gray.50',
                        _hover: {
                            bg: 'gray.100',
                        },
                        _focus: {
                            bg: 'white',
                            borderColor: 'brand.500',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'filled',
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'white',
                color: 'gray.800',
            },
        },
    },
});

export default theme; 