"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegistroPasajero() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí podrías enviar datos al backend o API
    router.push("/confirm-pasajero"); // Redirige a la pantalla de confirmación
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 p-6">
      <div className="container text-center max-w-md">
        
        {/* Imagen */}
        <Image src="/app.png" alt="Passenger" width={120} height={120} className="mb-4" />

        {/* Botones sociales */}
        <button className="w-full mb-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Continue with Google
        </button>
        <button className="w-full mb-6 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
          Continue with Facebook
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="email" 
            placeholder="Email" 
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded-lg shadow hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>

        {/* Link para login */}
        <p className="text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
