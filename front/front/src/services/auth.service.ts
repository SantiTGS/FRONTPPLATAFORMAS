import apiService from './api';
import { User } from '@/types';

// Tipos locales para este servicio
interface AuthResponse {
  access_token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'driver' | 'passenger';
  phone: string;
}

class AuthService {
  /**
   * Registrar un nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Transformar los datos al formato que espera el backend
      const backendData = {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: [data.role],  // role → roles (como array)
      };

      const response = await apiService.post<AuthResponse>('/auth/register', backendData);
      
      // Guardar token y usuario en localStorage
      if (response.access_token) {
        apiService.setToken(response.access_token);
        this.setUser(response.user);
      }
      
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Guardar token y usuario en localStorage
      if (response.access_token) {
        apiService.setToken(response.access_token);
        this.setUser(response.user);
      }
      
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    apiService.removeToken();
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    try {
      return await apiService.get<User>('/auth/profile');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }

  /**
   * Obtener usuario del localStorage
   */
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Guardar usuario en localStorage
   */
  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * Manejar errores de API
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Error en la solicitud';
      return new Error(message);
    }
    return new Error('Error de conexión. Verifica tu conexión a internet.');
  }
}

export default new AuthService();