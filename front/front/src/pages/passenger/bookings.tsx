import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await ridesService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tus reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (rideId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      setCancellingId(rideId);
      await ridesService.cancelBooking(rideId);
      await loadBookings(); // Recargar la lista
    } catch (err: any) {
      alert(err.message || 'Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en_curso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return '✅';
      case 'en_curso':
        return '🚗';
      case 'completado':
        return '🏁';
      case 'cancelado':
        return '❌';
      default:
        return '📋';
    }
  };

  // Separar reservas activas y completadas
  const activeBookings = bookings.filter(b => 
    b.estado === 'disponible' || b.estado === 'en_curso'
  );
  const pastBookings = bookings.filter(b => 
    b.estado === 'completado' || b.estado === 'cancelado'
  );

  return (
    <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900">Mis Reservas 📋</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tus viajes reservados
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando reservas...</p>
            </div>
          ) : (
            <>
              {/* Reservas Activas */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reservas Activas ({activeBookings.length})
                  </h2>
                </div>
                <div className="p-6">
                  {activeBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl mb-4 block">📭</span>
                      <p className="text-gray-500">No tienes reservas activas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((ride) => (
                        <div
                          key={ride._id}
                          className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            {/* Ruta */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ride.estado)}`}>
                                  {getStatusIcon(ride.estado)} {ride.estado}
                                </span>
                              </div>
                              
                              <div className="flex items-start space-x-3 mt-3">
                                <div className="flex flex-col items-center">
                                  <span className="text-2xl">📍</span>
                                  <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                                  <span className="text-2xl">📍</span>
                                </div>
                                <div className="flex-1">
                                  <div className="mb-3">
                                    <p className="text-lg font-bold text-gray-900">{ride.origen.ciudad}</p>
                                    <p className="text-sm text-gray-500">{ride.origen.direccion}</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{ride.destino.ciudad}</p>
                                    <p className="text-sm text-gray-500">{ride.destino.direccion}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <span className="mr-1">📅</span>
                                  <span>{formatDate(ride.fecha)}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="mr-1">🕐</span>
                                  <span>{ride.hora}</span>
                                </div>
                              </div>
                            </div>

                            {/* Precio y Acciones */}
                            <div className="flex flex-col items-end space-y-3">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Precio pagado</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  ${ride.precio.toLocaleString()}
                                </p>
                              </div>
                              
                              {ride.estado === 'disponible' && (
                                <button
                                  onClick={() => handleCancelBooking(ride._id)}
                                  disabled={cancellingId === ride._id}
                                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                  {cancellingId === ride._id ? 'Cancelando...' : 'Cancelar Reserva'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Historial */}
              {pastBookings.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Historial ({pastBookings.length})
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {pastBookings.map((ride) => (
                        <div
                          key={ride._id}
                          className="border border-gray-200 rounded-lg p-6 opacity-75"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ride.estado)}`}>
                                  {getStatusIcon(ride.estado)} {ride.estado}
                                </span>
                              </div>
                              
                              <p className="text-lg font-bold text-gray-900">
                                {ride.origen.ciudad} → {ride.destino.ciudad}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDate(ride.fecha)} • {ride.hora}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-600">
                                ${ride.precio.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}