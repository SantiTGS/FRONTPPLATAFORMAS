"use client";

import { useState } from "react";
import Link from "next/link";

type Ciudad = "Palmira" | "Cali";

const zonasPorCiudad: Record<Ciudad, string[]> = {
  Palmira: ["Llanogrande", "Unicentro"],
  Cali: ["Chipichape", "Unicentro"],
};

export default function SeleccionarCiudad() {
  const [origen, setOrigen] = useState<Ciudad | "">("");
  const [zona, setZona] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        City selection
      </h1>

      <form className="flex flex-col gap-5 w-full max-w-sm">

        {/* Origen */}
        <div className="flex flex-col text-gray-700">
          <label htmlFor="origen" className="font-medium">
            Place of origin
          </label>
          <select
            id="origen"
            value={origen}
            onChange={(e) => {
              setOrigen(e.target.value as Ciudad);
              setZona("");
            }}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select city</option>
            <option value="Palmira">Palmira</option>
            <option value="Cali">Cali</option>
          </select>
        </div>

        {/* Zona */}
        {origen && (
          <div className="flex flex-col text-gray-700">
            <label htmlFor="zona" className="font-medium">
              Zone
            </label>
            <select
              id="zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select area</option>
              {zonasPorCiudad[origen].map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Universidad */}
        <div className="flex flex-col text-gray-700">
          <label htmlFor="destino" className="font-medium">
            Destination university
          </label>
          <select
            id="destino"
            name="destino"
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select university</option>
            <option value="Autónoma">Autónoma</option>
            <option value="Javeriana">Javeriana</option>
            <option value="ICESI">ICESI</option>
          </select>
        </div>

        {/* Fecha */}
        <div className="flex flex-col text-gray-700">
          <label htmlFor="fecha" className="font-medium">
            Date
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Hora */}
        <div className="flex flex-col text-gray-700">
          <label htmlFor="hora" className="font-medium">
            Hour
          </label>
          <input
            type="time"
            id="hora"
            name="hora"
            required
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Botón */}
        <Link
          href="/confirm-trip"
          className="bg-black text-white py-3 rounded-lg text-center shadow-md hover:bg-gray-800 transition"
        >
          Create trip
        </Link>
      </form>
    </div>
  );
}

