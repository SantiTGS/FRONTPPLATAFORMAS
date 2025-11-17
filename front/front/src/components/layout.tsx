import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getNavLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { href: '/profile', label: 'Mi Perfil', icon: '👤' },
    ];

    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/admin/users', label: 'Usuarios', icon: '👥' },
          { href: '/admin/rides', label: 'Todos los Viajes', icon: '🚗' },
          ...commonLinks,
        ];
      
      case UserRole.DRIVER:
        return [
          { href: '/driver/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/driver/rides', label: 'Mis Viajes', icon: '🚗' },
          { href: '/driver/create-ride', label: 'Crear Viaje', icon: '➕' },
          ...commonLinks,
        ];
      
      case UserRole.PASSENGER:
        return [
          { href: '/passenger/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/passenger/search', label: 'Buscar Viajes', icon: '🔍' },
          { href: '/passenger/bookings', label: 'Mis Reservas', icon: '📋' },
          ...commonLinks,
        ];
      
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚗</span>
              <span className="text-xl font-bold text-blue-600">JSRL Cupos</span>
            </Link>

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      router.pathname === link.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* User menu */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === link.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 JSRL Cupos - Sistema de Ride Sharing
          </p>
        </div>
      </footer>
    </div>
  );
};