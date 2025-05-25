import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { type Cliente, clientesService } from '../api/services';

const ClientesList: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCliente, setCurrentCliente] = useState<Cliente>({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        direccion: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            const response = await clientesService.getAll();
            setClientes(response.data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    const handleOpenDialog = (cliente?: Cliente) => {
        if (cliente) {
            setCurrentCliente(cliente);
            setIsEditing(true);
        } else {
            setCurrentCliente({
                nombre: '',
                apellidos: '',
                telefono: '',
                email: '',
                direccion: '',
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCliente({
            nombre: '',
            apellidos: '',
            telefono: '',
            email: '',
            direccion: '',
        });
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentCliente(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditing && currentCliente.id) {
                await clientesService.update(currentCliente.id, currentCliente);
            } else {
                await clientesService.create(currentCliente);
            }
            handleCloseDialog();
            loadClientes();
        } catch (error) {
            console.error('Error al guardar cliente:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
            try {
                await clientesService.delete(id);
                loadClientes();
            } catch (error) {
                console.error('Error al eliminar cliente:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                style={{ marginBottom: '20px' }}
            >
                Nuevo Cliente
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell>{cliente.apellidos}</TableCell>
                                <TableCell>{cliente.telefono}</TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.direccion}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(cliente)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => cliente.id && handleDelete(cliente.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={currentCliente.nombre}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="apellidos"
                        label="Apellidos"
                        type="text"
                        fullWidth
                        value={currentCliente.apellidos}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="telefono"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={currentCliente.telefono}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={currentCliente.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="direccion"
                        label="Dirección"
                        type="text"
                        fullWidth
                        value={currentCliente.direccion}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ClientesList; 