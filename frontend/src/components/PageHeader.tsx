import React from 'react';
import { Box, Heading, Text, Flex, Button } from '@chakra-ui/react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
    return (
        <Box mb={8}>
            <Flex justify="space-between" align="center" mb={2}>
                <Heading size="lg">{title}</Heading>
                {action && (
                    <Button colorScheme="brand" onClick={action.onClick}>
                        {action.label}
                    </Button>
                )}
            </Flex>
            {description && (
                <Text color="gray.600" fontSize="md">
                    {description}
                </Text>
            )}
        </Box>
    );
};

export default PageHeader; 