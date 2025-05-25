export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  propietario: string;
  telefono: string;
  email: string;
  ultimoServicio?: Date;
}

export interface Cita {
  id: string;
  fecha: Date;
  hora: string;
  vehiculo: Vehiculo;
  tipo: 'mantenimiento' | 'reparacion' | 'revision';
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  descripcion: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: string;
  categoria: 'mantenimiento' | 'reparacion' | 'revision';
} 