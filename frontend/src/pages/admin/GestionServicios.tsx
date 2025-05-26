import React from 'react';
import { Box } from '@chakra-ui/react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { serviciosService } from '../../api/services';
import { Servicio } from '../../types';

const GestionServicios = () => {
    const { data: servicios, isLoading, error } = useQuery<Servicio[]>({
        queryKey: ['servicios'],
        queryFn: () => serviciosService.getAll(),
    });

    const columns = [
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Tipo', accessor: 'tipo' },
        { header: 'Precio Base', accessor: (servicio: Servicio) => `$${servicio.precio_base}` },
        { header: 'Duración', accessor: (servicio: Servicio) => `${servicio.duracion_estimada} min` },
        { header: 'Estado', accessor: (servicio: Servicio) => servicio.activo ? 'Activo' : 'Inactivo' },
    ];

    return (
        <Box>
            <PageHeader 
                title="Gestión de Servicios" 
                description="Administra los servicios ofrecidos"
                action={{
                    label: 'Nuevo Servicio',
                    onClick: () => console.log('Nuevo servicio'),
                }}
            />
            
            <Box bg="white" p={4} rounded="lg" shadow="lg">
                <DataTable
                    columns={columns}
                    data={servicios || []}
                    isLoading={isLoading}
                    error={error?.message}
                />
            </Box>
        </Box>
    );
};

export default GestionServicios; 