import Link from "next/link";
import Image from "next/image";

export default function AvailableQuotas() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      

      <h1 className="text-xl font-semibold mb-6">Available Rides</h1>

      {/* Contenido centrado */}
      <div className="w-full max-w-sm flex flex-col space-y-6">

        {/* Ride 1 */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">Campus → University Javeriana</h2>
          <p>Hour: 7:30 AM</p>
          <p className="mb-3">Available quotas: 3</p>

          <Link 
            href="/trip-details"
            className="bg-blue-900 text-white w-full block py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            View
          </Link>
        </div>

        {/* Ride 2 */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">Campus → University Javeriana</h2>
          <p>Hour: 8:00 AM</p>
          <p className="mb-3">Available quotas: 1</p>

          <Link 
            href="/trip-details"
            className="bg-blue-900 text-white w-full block py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            View
          </Link>
        </div>

      </div>

      {/* Volver */}
      <p className="mt-6 text-sm">
        <Link href="/select-city" className="text-blue-600 hover:underline">
          ← Go back
        </Link>
      </p>
    </div>
  );
}


