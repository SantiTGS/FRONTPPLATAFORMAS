"use client";

import Link from "next/link";
import Image from "next/image";

export default function Confirmacion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">

      <div className="flex flex-col items-center text-center max-w-sm w-full">
        
        {/* Imagen */}
        <Image
          src="/check.png"
          alt="Check icon"
          width={120}
          height={120}
          className="mb-6"
        />

        {/* Mensaje principal */}
        <h1 className="text-lg font-semibold text-gray-800 mb-2">
          Your account has been successfully created!!
        </h1>

        {/* Mensaje secundario */}
        <p className="text-gray-600 mb-8">
          Create your first trip
        </p>

        {/* Botón */}
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/create-trip"
            className="bg-black text-white py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Continue
          </Link>
        </div>

      </div>
    </div>
  );
}
