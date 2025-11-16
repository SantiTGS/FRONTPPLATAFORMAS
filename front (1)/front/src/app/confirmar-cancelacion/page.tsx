"use client";

import Link from "next/link";
import Image from "next/image";

export default function Confirmacion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">

      {/* Contenedor interno */}
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        
        {/* Imagen del check */}
        <Image
          src="/check.png"
          alt="Check icon"
          width={120}
          height={120}
          className="mb-6"
        />

        {/* Mensaje principal */}
        <h1 className="text-lg font-semibold text-gray-800 mb-2">
          Your service has been successfully accepted!!
        </h1>

        {/* Mensaje secundario */}
        <p className="text-gray-600 mb-8">
          A confirmation message will arrive soon.
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/seleccionar-ciudad"
            className="bg-black text-white py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Go to home
          </Link>

          <Link
            href="/my-trips"
            className="bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            See my trips
          </Link>
        </div>

      </div>
    </div>
  );
}
