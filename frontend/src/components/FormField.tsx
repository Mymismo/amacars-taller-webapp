import React from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    FormErrorMessage,
    InputProps,
    SelectProps,
    TextareaProps,
} from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
    label: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date';
    registration?: UseFormRegisterReturn;
    options?: { value: string; label: string }[];
    inputProps?: InputProps | SelectProps | TextareaProps;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    type = 'text',
    registration,
    options,
    inputProps,
}) => {
    const getInput = () => {
        switch (type) {
            case 'select':
                return (
                    <Select {...registration} {...(inputProps as SelectProps)}>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                );
            case 'textarea':
                return <Textarea {...registration} {...(inputProps as TextareaProps)} />;
            default:
                return <Input type={type} {...registration} {...(inputProps as InputProps)} />;
        }
    };

    return (
        <FormControl isInvalid={!!error} mb={4}>
            <FormLabel>{label}</FormLabel>
            {getInput()}
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};

export default FormField; 