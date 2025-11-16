"use client";

import Link from "next/link";

export default function TripDetails() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">

      <div className="flex flex-col items-center text-center max-w-sm w-full">

        {/* Información del viaje */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Campus → University Javeriana
        </h2>

        <p className="text-gray-600">Driver: Juan Pérez</p>
        <p className="text-gray-600">Hour: 7:30 AM</p>
        <p className="text-gray-600 mb-6">Available quotas: 3</p>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full">

          <button className="bg-black text-white py-2 rounded-lg shadow-md hover:bg-gray-800 transition">
            Reserve my seat
          </button>

          <Link
            href="/available-quotas"
            className="bg-gray-200 text-gray-700 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
          >
            Back
          </Link>

        </div>

      </div>
    </div>
  );
}