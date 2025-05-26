export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // en minutos
  activo: boolean;
  created_at: string;
  updated_at: string;
} 