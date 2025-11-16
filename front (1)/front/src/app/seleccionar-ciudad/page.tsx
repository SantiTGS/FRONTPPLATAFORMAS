"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipos de ciudades
type Ciudad = "Palmira" | "Cali";

// Zonas según ciudad
const zonasPorCiudad: Record<Ciudad, string[]> = {
  Palmira: ["Llanogrande", "Unicentro"],
  Cali: ["Chipichape", "Unicentro"],
};

export default function SeleccionarCiudad() {
  const [origen, setOrigen] = useState<Ciudad | "">("");
  const [zona, setZona] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">

      {/* Imagen tipo Login */}
      <div className="mb-4">
        <Image 
          src="/app.png"
          alt="City selection"
          width={120}
          height={120}
        />
      </div>

      {/* Título */}
      <h1 className="text-xl font-semibold mb-6">City selection</h1>

      {/* FORM */}
      <div className="w-full max-w-sm flex flex-col space-y-4 text-left">

        {/* Origen */}
        <select
          value={origen}
          onChange={(e) => {
            setOrigen(e.target.value as Ciudad);
            setZona("");
          }}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select city</option>
          <option value="Palmira">Palmira</option>
          <option value="Cali">Cali</option>
        </select>

        {/* Zona */}
        {origen && (
          <select
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select area</option>
            {zonasPorCiudad[origen].map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        )}

        {/* Universidad */}
        <select
          required
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select university</option>
          <option value="Autónoma">Autónoma</option>
          <option value="Javeriana">Javeriana</option>
          <option value="ICESI">ICESI</option>
        </select>

        {/* Fecha */}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Botón */}
        <Link
          href="/available-quotas"
          className="bg-blue-900 text-white py-2 text-center rounded-lg shadow 
          hover:bg-blue-800 transition"
        >
          Search for available spaces
        </Link>
      </div>
    </div>
  );
}

