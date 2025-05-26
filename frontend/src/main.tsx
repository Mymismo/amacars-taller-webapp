import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true }}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ChakraProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
