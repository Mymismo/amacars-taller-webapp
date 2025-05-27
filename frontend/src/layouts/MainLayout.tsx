import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const contentBg = useColorModeValue('white', 'gray.800');

    return (
        <Box minH="100vh" maxH="100vh" display="flex" flexDirection="column" bg={bgColor} overflow="hidden">
            <Navbar />
            <Flex flex="1" overflow="hidden">
                {isAuthenticated && (
                    <Box 
                        w="250px" 
                        display={{ base: 'none', md: 'block' }}
                        h="calc(100vh - 64px)"
                        overflowY="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: useColorModeValue('gray.300', 'gray.600'),
                                borderRadius: '24px',
                            },
                        }}
                    >
                        <Sidebar />
                    </Box>
                )}
                <Box 
                    flex="1" 
                    py={4} 
                    px={{ base: 2, md: 4 }}
                    h="calc(100vh - 64px)"
                    overflowY="auto"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: useColorModeValue('gray.300', 'gray.600'),
                            borderRadius: '24px',
                        },
                    }}
                >
                    <Container 
                        maxW="container.xl" 
                        bg={contentBg}
                        borderRadius="xl"
                        boxShadow="sm"
                        p={{ base: 3, md: 4 }}
                        minH="calc(100vh - 96px)"
                    >
                        <Outlet />
                    </Container>
                </Box>
            </Flex>
            <Footer />
        </Box>
    );
};

export default MainLayout; 