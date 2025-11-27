import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Ride } from '@/types';
import ridesService from '@/services/rides.service';
import Link from 'next/link';

export default function SearchRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    origen: '',
    destino: '',
    fecha: '',
  });

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await ridesService.getAvailableRides(searchFilters);
      setRides(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar viajes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    loadRides(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ origen: '', destino: '', fecha: '' });
    loadRides();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PASSENGER]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900">Buscar Viajes 🔍</h1>
            <p className="mt-2 text-gray-600">
              Encuentra el viaje perfecto para ti
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="origen" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad de Origen
                  </label>
                  <input
                    type="text"
                    id="origen"
                    name="origen"
                    value={filters.origen}
                    onChange={handleFilterChange}
                    placeholder="Ej: Cali"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad de Destino
                  </label>
                  <input
                    type="text"
                    id="destino"
                    name="destino"
                    value={filters.destino}
                    onChange={handleFilterChange}
                    placeholder="Ej: Jamundi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={filters.fecha}
                    onChange={handleFilterChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  🔍 Buscar
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Viajes Disponibles ({rides.length})
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Buscando viajes...</p>
                </div>
              ) : rides.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🚗</span>
                  <p className="text-gray-500 text-lg">No se encontraron viajes disponibles</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Intenta con otros filtros o revisa más tarde
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rides.map((ride) => (
                    <div
                      key={ride._id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        {/* Ruta */}
                        <div className="flex-1">
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

                          {/* Detalles */}
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-1">📅</span>
                              <span>{formatDate(ride.fecha)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">🕐</span>
                              <span>{ride.hora}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">👥</span>
                              <span>{ride.cuposDisponibles} cupos disponibles</span>
                            </div>
                          </div>
                        </div>

                        {/* Precio y Acción */}
                        <div className="flex flex-col items-end space-y-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Precio por cupo</p>
                            <p className="text-3xl font-bold text-blue-600">
                              ${ride.precio.toLocaleString()}
                            </p>
                          </div>
                          <Link
                            href={`/passenger/rides/${ride._id}`}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Ver Detalles →
                          </Link>
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