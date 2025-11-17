import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DriverRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'disponible' | 'en_curso' | 'completado' | 'cancelado'>('all');

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setLoading(true);
      const data = await ridesService.getMyRides();
      setRides(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tus viajes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRide = async (rideId: string) => {
    try {
      setActionLoading(true);
      await ridesService.startRide(rideId);
      await loadRides();
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
      await loadRides();
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
      await ridesService.cancelRide(rideId);
      await loadRides();
      alert('Viaje cancelado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al cancelar el viaje');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!confirm('¿Estás seguro de eliminar este viaje? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setActionLoading(true);
      await ridesService.deleteRide(rideId);
      await loadRides();
      alert('Viaje eliminado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el viaje');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
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

  const isRideOwner = (ride: Ride) => {
  if (!user || !ride.conductor) return false;
  
  // Normalizar IDs a strings para comparación
  const userId = user._id?.toString();
  const conductorId = typeof ride.conductor === 'string' 
    ? ride.conductor 
    : ride.conductor._id?.toString();
  
  console.log('🔍 Checking ownership:', { userId, conductorId, match: userId === conductorId });
  
  return userId === conductorId;
};

  // Filtrar viajes
  const filteredRides = filter === 'all' 
    ? rides 
    : rides.filter(ride => ride.estado === filter);

  return (
    <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Viajes 🚗</h1>
                <p className="mt-2 text-gray-600">
                  Gestiona todos tus viajes
                </p>
              </div>
              <Link
                href="/driver/create-ride"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md"
              >
                ➕ Crear Viaje
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({rides.length})
              </button>
              <button
                onClick={() => setFilter('disponible')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'disponible'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Disponibles ({rides.filter(r => r.estado === 'disponible').length})
              </button>
              <button
                onClick={() => setFilter('en_curso')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'en_curso'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En Curso ({rides.filter(r => r.estado === 'en_curso').length})
              </button>
              <button
                onClick={() => setFilter('completado')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'completado'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completados ({rides.filter(r => r.estado === 'completado').length})
              </button>
              <button
                onClick={() => setFilter('cancelado')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'cancelado'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelados ({rides.filter(r => r.estado === 'cancelado').length})
              </button>
            </div>
          </div>

          {/* Rides List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando viajes...</p>
                </div>
              ) : filteredRides.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🚗</span>
                  <p className="text-gray-500 text-lg">No hay viajes en esta categoría</p>
                  {filter === 'all' && (
                    <Link
                      href="/driver/create-ride"
                      className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Crear Primer Viaje
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRides.map((ride) => {
                    const cuposReservados = ride.cuposTotales - ride.cuposDisponibles;
                    const gananciaActual = ride.precio * cuposReservados;
                    const isOwner = isRideOwner(ride);

                    return (
                      <div
                        key={ride._id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                          {/* Info Principal */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ride.estado)}`}>
                                {ride.estado}
                              </span>
                              {!isOwner && ride.conductor && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                  👤 {ride.conductor.name}
                                </span>
                              )}
                            </div>

                            <div className="flex items-start space-x-3">
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

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">Fecha</p>
                                <p className="font-medium text-gray-900">{formatDate(ride.fecha)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Hora</p>
                                <p className="font-medium text-gray-900">{ride.hora}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Cupos</p>
                                <p className="font-medium text-gray-900">
                                  {cuposReservados}/{ride.cuposTotales} reservados
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Ganancia</p>
                                <p className="font-medium text-green-600">
                                  ${gananciaActual.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col justify-between space-y-2 lg:w-48">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Precio/cupo</p>
                              <p className="text-2xl font-bold text-blue-600">
                                ${ride.precio.toLocaleString()}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {/* Solo mostrar botones si el usuario es el dueño del viaje */}
                              {isOwner ? (
                                <>
                                  {ride.estado === 'disponible' && (
                                    <>
                                      <button
                                        onClick={() => handleStartRide(ride._id)}
                                        disabled={actionLoading}
                                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Iniciar Viaje
                                      </button>
                                      <button
                                        onClick={() => handleCancelRide(ride._id)}
                                        disabled={actionLoading}
                                        className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Cancelar
                                      </button>
                                    </>
                                  )}
                                  {ride.estado === 'en_curso' && (
                                    <button
                                      onClick={() => handleCompleteRide(ride._id)}
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Completar
                                    </button>
                                  )}
                                  {(ride.estado === 'completado' || ride.estado === 'cancelado') && (
                                    <button
                                      onClick={() => handleDeleteRide(ride._id)}
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Eliminar
                                    </button>
                                  )}
                                </>
                              ) : (
                                <div className="text-center p-3 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-xs text-gray-600">
                                    🔒 Solo el conductor puede gestionar este viaje
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}