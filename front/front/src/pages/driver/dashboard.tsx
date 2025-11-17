import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyRides();
  }, []);

  const loadMyRides = async () => {
    try {
      setLoading(true);
      const rides = await ridesService.getMyRides();
      setMyRides(rides);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tus viajes');
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

  const handleStartRide = async (rideId: string) => {
    try {
      setActionLoading(true);
      await ridesService.startRide(rideId);
      await loadMyRides();
      alert('Viaje iniciado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al iniciar el viaje');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      setActionLoading(true);
      await ridesService.completeRide(rideId);
      await loadMyRides();
      alert('Viaje completado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al completar el viaje');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    if (!confirm('¿Estás seguro de cancelar este viaje?')) {
      return;
    }

    try {
      setActionLoading(true);
      await ridesService.deleteRide(rideId);
      await loadMyRides();
      alert('Viaje cancelado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al cancelar el viaje');
    } finally {
      setActionLoading(false);
    }
  };

  // Calcular estadísticas
  const stats = {
    totalRides: myRides.length,
    activeRides: myRides.filter(r => r.estado === 'disponible' || r.estado === 'en_curso').length,
    completedRides: myRides.filter(r => r.estado === 'completado').length,
    totalEarnings: myRides
      .filter(r => r.estado === 'completado')
      .reduce((sum, ride) => {
        const reservedSeats = ride.cuposTotales - ride.cuposDisponibles;
        return sum + (ride.precio * reservedSeats);
      }, 0),
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {user?.name}! 🚗
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenido a tu panel de conductor
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
                  <span className="text-2xl">🚗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Viajes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <span className="text-2xl">🟢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Viajes Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completados</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Ganancias</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              href="/driver/create-ride"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              <span className="mr-2">➕</span>
              Crear Nuevo Viaje
            </Link>
          </div>

          {/* Mis Viajes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Mis Viajes</h2>
                <Link
                  href="/driver/rides"
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
              ) : myRides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No has creado ningún viaje todavía</p>
                  <Link
                    href="/driver/create-ride"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Crear Primer Viaje
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRides.slice(0, 5).map((ride) => (
                    <div
                      key={ride._id}
                      className="border border-gray-200 rounded-lg p-4"
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
                            <span>👥 {ride.cuposDisponibles}/{ride.cuposTotales} disponibles</span>
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
                          
                          {/* Status Actions */}
                          {ride.estado === 'disponible' && (
                            <div className="mt-3 space-x-2">
                              <button
                                onClick={() => handleStartRide(ride._id)}
                                disabled={actionLoading}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                Iniciar
                              </button>
                              <button
                                onClick={() => handleCancelRide(ride._id)}
                                disabled={actionLoading}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                          {ride.estado === 'en_curso' && (
                            <button
                              onClick={() => handleCompleteRide(ride._id)}
                              disabled={actionLoading}
                              className="mt-3 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Completar
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
        </div>
      </Layout>
    </ProtectedRoute>
  );
}