import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Si hay roles permitidos y el usuario no tiene el rol adecuado
      if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
        // Redirigir al dashboard apropiado según su rol
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'driver') {
          router.push('/driver/dashboard');
        } else {
          router.push('/passenger/dashboard');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene el rol adecuado, no mostrar nada
  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role as UserRole))) {
    return null;
  }

  return <>{children}</>;
};