import React from 'react';
import { Box } from '@chakra-ui/react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { presupuestosService } from '../../api/services';
import { Presupuesto, EstadoPresupuesto } from '../../types';

const Presupuestos = () => {
    const { data: presupuestos, isLoading, error } = useQuery<Presupuesto[]>({
        queryKey: ['presupuestos'],
        queryFn: () => presupuestosService.getAll(),
    });

    const columns = [
        { header: 'Cita ID', accessor: 'cita_id' },
        { 
            header: 'Total', 
            accessor: (presupuesto: Presupuesto) => 
                new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                }).format(presupuesto.total)
        },
        { 
            header: 'Estado', 
            accessor: (presupuesto: Presupuesto) => {
                const estados: Record<EstadoPresupuesto, string> = {
                    [EstadoPresupuesto.PENDIENTE]: '⏳ Pendiente',
                    [EstadoPresupuesto.ACEPTADO]: '✅ Aceptado',
                    [EstadoPresupuesto.RECHAZADO]: '❌ Rechazado',
                };
                return estados[presupuesto.estado];
            }
        },
        { header: 'Fecha Emisión', accessor: 'fecha_emision' },
        { header: 'Fecha Validez', accessor: 'fecha_validez' },
    ];

    return (
        <Box>
            <PageHeader 
                title="Presupuestos" 
                description="Gestiona los presupuestos del taller"
                action={{
                    label: 'Nuevo Presupuesto',
                    onClick: () => console.log('Nuevo presupuesto'),
                }}
            />
            
            <Box bg="white" p={4} rounded="lg" shadow="lg">
                <DataTable
                    columns={columns}
                    data={presupuestos || []}
                    isLoading={isLoading}
                    error={error?.message}
                />
            </Box>
        </Box>
    );
};

export default Presupuestos; 