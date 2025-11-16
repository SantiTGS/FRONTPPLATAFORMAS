import Link from "next/link";

export default function CrearCuenta() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        How do you want to register?
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
      
        <Link href="/register">
          <div className="cursor-pointer hover:scale-105 transition-transform">
            <img 
              src="/driver.png.png" 
              alt="Driver" 
              className="w-40 h-40 object-contain shadow-md rounded-lg"
            />
          </div>
        </Link>

       
        <Link href="/registro-pasajero">
          <div className="cursor-pointer hover:scale-105 transition-transform">
            <img 
              src="/passenger.png.png" 
              alt="Pasajero" 
              className="w-40 h-40 object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

