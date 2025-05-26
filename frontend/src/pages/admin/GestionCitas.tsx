import React from 'react';
import { Box } from '@chakra-ui/react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { citasService } from '../../api/services';
import { Cita, EstadoCita } from '../../types';

const GestionCitas = () => {
    const { data: citas, isLoading, error } = useQuery<Cita[]>({
        queryKey: ['citas'],
        queryFn: () => citasService.getAll(),
    });

    const columns = [
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Hora', accessor: 'hora' },
        { header: 'Cliente ID', accessor: 'cliente_id' },
        { header: 'Vehículo ID', accessor: 'vehiculo_id' },
        { 
            header: 'Estado', 
            accessor: (cita: Cita) => {
                const estados: Record<EstadoCita, string> = {
                    [EstadoCita.PENDIENTE]: '⏳ Pendiente',
                    [EstadoCita.CONFIRMADA]: '✅ Confirmada',
                    [EstadoCita.EN_PROCESO]: '🔧 En Proceso',
                    [EstadoCita.COMPLETADA]: '✨ Completada',
                    [EstadoCita.CANCELADA]: '❌ Cancelada',
                };
                return estados[cita.estado];
            }
        },
    ];

    return (
        <Box>
            <PageHeader 
                title="Gestión de Citas" 
                description="Administra las citas del taller"
                action={{
                    label: 'Nueva Cita',
                    onClick: () => console.log('Nueva cita'),
                }}
            />
            
            <Box bg="white" p={4} rounded="lg" shadow="lg">
                <DataTable
                    columns={columns}
                    data={citas || []}
                    isLoading={isLoading}
                    error={error?.message}
                />
            </Box>
        </Box>
    );
};

export default GestionCitas; 