import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, RideFormData } from '@/types';
import ridesService from '@/services/rides.service';
import { useRouter } from 'next/router';

export default function CreateRide() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RideFormData>({
    origen: {
      ciudad: '',
      direccion: '',
    },
    destino: {
      ciudad: '',
      direccion: '',
    },
    fecha: '',
    hora: '',
    cuposTotales: 4,
    precio: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('origen.') || name.startsWith('destino.')) {
      const [location, field] = name.split('.');
      setFormData({
        ...formData,
        [location]: {
          ...(formData as any)[location],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'cuposTotales' ? parseInt(value) || 0 : 
                name === 'precio' ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.origen.ciudad || !formData.origen.direccion) {
      setError('Debes completar la información del origen');
      return;
    }

    if (!formData.destino.ciudad || !formData.destino.direccion) {
      setError('Debes completar la información del destino');
      return;
    }

    if (!formData.fecha || !formData.hora) {
      setError('Debes seleccionar fecha y hora');
      return;
    }

    if (formData.cuposTotales < 1) {
      setError('Debes tener al menos 1 cupo disponible');
      return;
    }

    if (formData.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(`${formData.fecha}T${formData.hora}`);
    if (selectedDate < new Date()) {
      setError('La fecha y hora deben ser futuras');
      return;
    }

    try {
      setLoading(true);
      await ridesService.createRide(formData);
      router.push('/driver/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al crear el viaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Viaje</h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Origen */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Origen</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="origen.ciudad" className="block text-sm font-medium text-gray-700">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="origen.ciudad"
                      name="origen.ciudad"
                      required
                      value={formData.origen.ciudad}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Cali"
                    />
                  </div>
                  <div>
                    <label htmlFor="origen.direccion" className="block text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="origen.direccion"
                      name="origen.direccion"
                      required
                      value={formData.origen.direccion}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Calle 100 #15-20"
                    />
                  </div>
                </div>
              </div>

              {/* Destino */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Destino</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="destino.ciudad" className="block text-sm font-medium text-gray-700">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="destino.ciudad"
                      name="destino.ciudad"
                      required
                      value={formData.destino.ciudad}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Jamundi"
                    />
                  </div>
                  <div>
                    <label htmlFor="destino.direccion" className="block text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="destino.direccion"
                      name="destino.direccion"
                      required
                      value={formData.destino.direccion}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Carrera 70 #50-30"
                    />
                  </div>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                    📅 Fecha
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    required
                    value={formData.fecha}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                    🕐 Hora
                  </label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    required
                    value={formData.hora}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cupos y Precio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cuposTotales" className="block text-sm font-medium text-gray-700">
                    👥 Cupos Totales
                  </label>
                  <input
                    type="number"
                    id="cuposTotales"
                    name="cuposTotales"
                    required
                    min="1"
                    max="10"
                    value={formData.cuposTotales}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Número de pasajeros que pueden viajar</p>
                </div>
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                    💰 Precio por Cupo (COP)
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    required
                    min="0"
                    step="1000"
                    value={formData.precio}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50000"
                  />
                  <p className="mt-1 text-xs text-gray-500">Precio que pagará cada pasajero</p>
                </div>
              </div>

              {/* Resumen */}
              {formData.cuposTotales > 0 && formData.precio > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Ganancia potencial:</strong> ${(formData.cuposTotales * formData.precio).toLocaleString()} COP
                    <span className="text-xs block mt-1">(si se llenan todos los cupos)</span>
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creando...
                    </span>
                  ) : (
                    'Crear Viaje'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}