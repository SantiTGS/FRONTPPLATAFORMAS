import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
        // Redirigir según el rol del usuario
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'driver') {
          router.push('/driver/dashboard');
        } else {
          router.push('/passenger/dashboard');
        }
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <span className="text-6xl animate-bounce">🚗</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSRL Cupos</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}