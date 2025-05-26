import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Text,
    Spinner,
    Center,
} from '@chakra-ui/react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    error?: string;
}

function DataTable<T extends { id: number | string }>({
    columns,
    data,
    isLoading,
    error,
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <Center p={8}>
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center p={8}>
                <Text color="red.500">{error}</Text>
            </Center>
        );
    }

    if (!data.length) {
        return (
            <Center p={8}>
                <Text color="gray.500">No hay datos disponibles</Text>
            </Center>
        );
    }

    return (
        <Box overflowX="auto">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th key={index}>
                                {column.header}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item) => (
                        <Tr key={item.id}>
                            {columns.map((column, index) => (
                                <Td key={index}>
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : item[column.accessor]}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}

export default DataTable; 