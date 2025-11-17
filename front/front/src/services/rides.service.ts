import apiService from './api';
import { Ride, RideFormData } from '@/types';

class RidesService {
  /**
   * Transformar datos del backend al formato del frontend
   */
  private transformRide(backendRide: any): Ride {
    return {
      _id: backendRide._id || backendRide.id,
      origen: {
        ciudad: backendRide.origin?.split(' - ')[0] || backendRide.origin || '',
        direccion: backendRide.origin?.split(' - ')[1] || '',
      },
      destino: {
        ciudad: backendRide.destination?.split(' - ')[0] || backendRide.destination || '',
        direccion: backendRide.destination?.split(' - ')[1] || '',
      },
      fecha: backendRide.date || '',
      hora: backendRide.time || '',
      cuposDisponibles: backendRide.availableSeats || 0,
      cuposTotales: backendRide.seats || 0,
      precio: backendRide.price || 0,
      estado: backendRide.status === 'pending' ? 'disponible' :
              backendRide.status === 'accepted' ? 'en_curso' :
              backendRide.status === 'completed' ? 'completado' : 'cancelado',
      conductor: backendRide.createdBy,
      pasajeros: backendRide.passengers || [],
      createdAt: backendRide.createdAt,
      updatedAt: backendRide.updatedAt,
    };
  }

  /**
   * Obtener todos los viajes disponibles
   */
  async getAvailableRides(filters?: {
    origen?: string;
    destino?: string;
    fecha?: string;
  }): Promise<Ride[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.origen) params.append('origen', filters.origen);
      if (filters?.destino) params.append('destino', filters.destino);
      if (filters?.fecha) params.append('fecha', filters.fecha);

      const queryString = params.toString();
      const url = queryString ? `/rides?${queryString}` : '/rides';
      
      const data = await apiService.get<any[]>(url);
      return data.map(ride => this.transformRide(ride));
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener un viaje por ID
   */
  async getRideById(id: string): Promise<Ride> {
    try {
      const data = await apiService.get<any>(`/rides/${id}`);
      return this.transformRide(data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Crear un nuevo viaje (solo conductores)
   */
  async createRide(data: RideFormData): Promise<Ride> {
    try {
      // Transformar datos al formato del backend
      const backendData = {
        origin: `${data.origen.ciudad} - ${data.origen.direccion}`,
        destination: `${data.destino.ciudad} - ${data.destino.direccion}`,
        date: data.fecha,
        time: data.hora,
        price: Number(data.precio),
        seats: Number(data.cuposTotales),
        description: `Viaje programado para ${data.fecha} a las ${data.hora}`,
      };

      console.log('Enviando al backend:', backendData);

      const response = await apiService.post<any>('/rides', backendData);
      return this.transformRide(response);
    } catch (error: any) {
      console.error('Error completo:', error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Actualizar un viaje existente
   */
  async updateRide(id: string, data: Partial<RideFormData>): Promise<Ride> {
    try {
      const response = await apiService.put<any>(`/rides/${id}`, data);
      return this.transformRide(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Eliminar un viaje
   */
  async deleteRide(id: string): Promise<void> {
    try {
      await apiService.delete(`/rides/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener viajes del conductor actual
   */
  async getMyRides(): Promise<Ride[]> {
    try {
      const data = await apiService.get<any[]>('/rides/my-rides');
      return data.map(ride => this.transformRide(ride));
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Iniciar un viaje (cambiar a en_curso)
   */
  async startRide(rideId: string): Promise<Ride> {
    try {
      const data = await apiService.patch<any>(`/rides/${rideId}/start`);
      return this.transformRide(data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Reservar cupo(s) en un viaje
   */
  async bookRide(rideId: string, seats: number = 1): Promise<Ride> {
    try {
      const data = await apiService.post<any>(`/rides/${rideId}/book`, { seats });
      return this.transformRide(data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancelar un viaje (cambiar estado a cancelado)
   */
  async cancelRide(rideId: string): Promise<Ride> {
    try {
      const data = await apiService.patch<any>(`/rides/${rideId}/cancel`);
      return this.transformRide(data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener reservas del usuario actual
   */
  async getMyBookings(): Promise<Ride[]> {
    try {
      const data = await apiService.get<any[]>('/rides/my-bookings');
      return data.map(ride => this.transformRide(ride));
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancelar una reserva
   */
  async cancelBooking(rideId: string): Promise<void> {
    try {
      await apiService.delete(`/rides/${rideId}/book`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Completar un viaje
   */
  async completeRide(rideId: string): Promise<Ride> {
    try {
      const data = await apiService.post<any>(`/rides/${rideId}/complete`);
      return this.transformRide(data);
    } catch (error: any) {
      throw this.handleError(error);
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

export default new RidesService();