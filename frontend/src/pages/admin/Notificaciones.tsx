import React from 'react';
import { Box } from '@chakra-ui/react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { notificacionesService } from '../../api/services';
import { Notificacion } from '../../types';

const Notificaciones = () => {
    const { data: notificaciones, isLoading, error } = useQuery<Notificacion[]>({
        queryKey: ['notificaciones'],
        queryFn: () => notificacionesService.getAll(),
    });

    const columns = [
        { header: 'Título', accessor: 'titulo' },
        { header: 'Mensaje', accessor: 'mensaje' },
        { header: 'Usuario ID', accessor: 'usuario_id' },
        { 
            header: 'Estado', 
            accessor: (notificacion: Notificacion) => 
                notificacion.leida ? '✓ Leída' : '• No leída'
        },
        { header: 'Fecha', accessor: 'fecha_creacion' },
    ];

    return (
        <Box>
            <PageHeader 
                title="Notificaciones" 
                description="Gestiona las notificaciones del sistema"
                action={{
                    label: 'Nueva Notificación',
                    onClick: () => console.log('Nueva notificación'),
                }}
            />
            
            <Box bg="white" p={4} rounded="lg" shadow="lg">
                <DataTable
                    columns={columns}
                    data={notificaciones || []}
                    isLoading={isLoading}
                    error={error?.message}
                />
            </Box>
        </Box>
    );
};

export default Notificaciones; 