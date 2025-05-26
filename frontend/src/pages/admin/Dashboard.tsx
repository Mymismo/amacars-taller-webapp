import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import PageHeader from '../../components/PageHeader';

const Dashboard = () => {
    return (
        <Box>
            <PageHeader 
                title="Dashboard" 
                description="Resumen general del sistema"
            />
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
                <Stat
                    px={{ base: 2, md: 4 }}
                    py={'5'}
                    shadow={'xl'}
                    border={'1px solid'}
                    borderColor={'gray.200'}
                    rounded={'lg'}
                    bg="white"
                >
                    <StatLabel fontSize={'lg'}>Citas Pendientes</StatLabel>
                    <StatNumber fontSize={'2xl'}>0</StatNumber>
                    <StatHelpText>Para hoy</StatHelpText>
                </Stat>

                <Stat
                    px={{ base: 2, md: 4 }}
                    py={'5'}
                    shadow={'xl'}
                    border={'1px solid'}
                    borderColor={'gray.200'}
                    rounded={'lg'}
                    bg="white"
                >
                    <StatLabel fontSize={'lg'}>Vehículos en Taller</StatLabel>
                    <StatNumber fontSize={'2xl'}>0</StatNumber>
                    <StatHelpText>En proceso</StatHelpText>
                </Stat>

                <Stat
                    px={{ base: 2, md: 4 }}
                    py={'5'}
                    shadow={'xl'}
                    border={'1px solid'}
                    borderColor={'gray.200'}
                    rounded={'lg'}
                    bg="white"
                >
                    <StatLabel fontSize={'lg'}>Presupuestos</StatLabel>
                    <StatNumber fontSize={'2xl'}>0</StatNumber>
                    <StatHelpText>Pendientes de aprobación</StatHelpText>
                </Stat>
            </SimpleGrid>
        </Box>
    );
};

export default Dashboard; 