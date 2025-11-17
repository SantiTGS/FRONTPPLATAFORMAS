import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';

export default function RideDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [cuposReservados, setCuposReservados] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadRide();
    }
  }, [id]);

  const loadRide = async () => {
    try {
      setLoading(true);
      const data = await ridesService.getRideById(id as string);
      setRide(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el viaje');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ride) return;

    if (cuposReservados < 1 || cuposReservados > ride.cuposDisponibles) {
      setError(`Debes reservar entre 1 y ${ride.cuposDisponibles} cupos`);
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      // ← CORREGIDO: Enviar la cantidad de cupos
      await ridesService.bookRide(ride._id, cuposReservados);
      setSuccessMessage(`¡Reserva de ${cuposReservados} cupo(s) realizada exitosamente!`);
      setTimeout(() => {
        router.push('/passenger/bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al realizar la reserva');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
        <Layout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalles del viaje...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error && !ride) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
        <Layout>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!ride) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <span className="mr-2">←</span>
            Volver a búsqueda
          </button>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h1 className="text-2xl font-bold mb-2">Detalles del Viaje</h1>
              <p className="text-blue-100">{formatDate(ride.fecha)} • {ride.hora}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Route */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">RUTA</h3>
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <div className="w-0.5 h-16 bg-gray-300 my-2"></div>
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{ride.origen.ciudad}</p>
                      <p className="text-sm text-gray-600">{ride.origen.direccion}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{ride.destino.ciudad}</p>
                      <p className="text-sm text-gray-600">{ride.destino.direccion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cupos Disponibles</p>
                    <p className="text-lg font-bold text-gray-900">
                      {ride.cuposDisponibles} de {ride.cuposTotales}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio por Cupo</p>
                    <p className="text-lg font-bold text-green-600">
                      ${ride.precio.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">
                      {ride.estado === 'disponible' ? '✅' : '⏸️'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {ride.estado}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              {ride.estado === 'disponible' && ride.cuposDisponibles > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Realizar Reserva</h3>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label htmlFor="cuposReservados" className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Cuántos cupos deseas reservar?
                      </label>
                      <input
                        type="number"
                        id="cuposReservados"
                        min="1"
                        max={ride.cuposDisponibles}
                        value={cuposReservados}
                        onChange={(e) => setCuposReservados(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Disponibles: {ride.cuposDisponibles}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total a pagar:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${(ride.precio * cuposReservados).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {cuposReservados} cupo{cuposReservados > 1 ? 's' : ''} × ${ride.precio.toLocaleString()}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Procesando reserva...
                        </span>
                      ) : (
                        'Confirmar Reserva'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Not Available Message */}
              {(ride.estado !== 'disponible' || ride.cuposDisponibles === 0) && (
                <div className="border-t pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      {ride.cuposDisponibles === 0 
                        ? '❌ Este viaje ya no tiene cupos disponibles'
                        : '⚠️ Este viaje no está disponible para reservas'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}