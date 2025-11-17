import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PassengerDashboard() {
  const { user } = useAuth();
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [myBookings, setMyBookings] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rides, bookings] = await Promise.all([
        ridesService.getAvailableRides(),
        ridesService.getMyBookings(),
      ]);
      setAvailableRides(rides.slice(0, 5)); // Mostrar solo los primeros 5
      setMyBookings(bookings);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calcular estadísticas
  const stats = {
    totalBookings: myBookings.length,
    activeBookings: myBookings.filter(r => r.estado === 'disponible' || r.estado === 'en_curso').length,
    completedBookings: myBookings.filter(r => r.estado === 'completado').length,
    totalSpent: myBookings
      .filter(r => r.estado === 'completado')
      .reduce((sum, ride) => sum + ride.precio, 0),
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Encuentra tu próximo viaje
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <span className="text-2xl">🎫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Mis Reservas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <span className="text-2xl">🟢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Activas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completadas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Gastado</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              href="/passenger/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              <span className="mr-2">🔍</span>
              Buscar Viajes
            </Link>
          </div>

          {/* Viajes Disponibles */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Viajes Disponibles</h2>
                <Link
                  href="/passenger/search"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todos →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando...</p>
                </div>
              ) : availableRides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay viajes disponibles en este momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRides.map((ride) => (
                    <div
                      key={ride._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">📍</span>
                            <div>
                              <p className="font-medium text-gray-900">{ride.origen.ciudad}</p>
                              <p className="text-sm text-gray-500">{ride.origen.direccion}</p>
                            </div>
                          </div>
                          <div className="my-2 ml-6 border-l-2 border-gray-300 h-4"></div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">📍</span>
                            <div>
                              <p className="font-medium text-gray-900">{ride.destino.ciudad}</p>
                              <p className="text-sm text-gray-500">{ride.destino.direccion}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                            <span>📅 {formatDate(ride.fecha)}</span>
                            <span>🕐 {ride.hora}</span>
                            <span>👥 {ride.cuposDisponibles} cupos disponibles</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-blue-600">
                            ${ride.precio.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">por persona</p>
                          <Link
                            href={`/passenger/rides/${ride._id}`}
                            className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mis Reservas Recientes */}
          {myBookings.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Reservas</h2>
                  <Link
                    href="/passenger/bookings"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {myBookings.slice(0, 3).map((ride) => (
                    <div
                      key={ride._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">📍</span>
                            <p className="font-medium text-gray-900">
                              {ride.origen.ciudad} → {ride.destino.ciudad}
                            </p>
                          </div>
                          <div className="mt-2 ml-8 text-sm text-gray-600">
                            <span>📅 {formatDate(ride.fecha)}</span>
                            <span className="ml-4">🕐 {ride.hora}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-blue-600">
                            ${ride.precio.toLocaleString()}
                          </p>
                          <span className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            ride.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                            ride.estado === 'en_curso' ? 'bg-blue-100 text-blue-800' :
                            ride.estado === 'completado' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ride.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}