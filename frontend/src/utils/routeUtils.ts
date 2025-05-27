import { RolUsuario } from '../types';

export const getInitialRoute = (rol: RolUsuario): string => {
    const rolNormalizado = rol.toUpperCase() as RolUsuario;
    
    switch (rolNormalizado) {
        case 'ADMIN':
            return '/dashboard';
        case 'MECANICO':
            return '/citas-asignadas';
        case 'RECEPCIONISTA':
            return '/citas';
        case 'CLIENTE':
            return '/mis-citas';
        default:
            return '/';
    }
}; 