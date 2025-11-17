export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  PASSENGER = 'passenger',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'passenger';
  phone?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'driver' | 'passenger';
  phone: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;  // ← AGREGADO
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface Location {
  ciudad: string;
  direccion: string;
}

export interface Ride {
  _id: string;
  origen: Location;
  destino: Location;
  fecha: string;
  hora: string;
  cuposDisponibles: number;
  cuposTotales: number;
  precio: number;
  estado: 'disponible' | 'en_curso' | 'completado' | 'cancelado';
  conductor: User;
  pasajeros: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RideFormData {
  origen: Location;
  destino: Location;
  fecha: string;
  hora: string;
  cuposTotales: number;
  precio: number;
}