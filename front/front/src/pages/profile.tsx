import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Rol</label>
                <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Miembro desde: {new Date(user.createdAt || '').toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}