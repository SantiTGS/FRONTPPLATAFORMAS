import Link from "next/link";

export default function MyTrips() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-100">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">My Trips</h1>
      </header>

      {/* Contenedor de las tarjetas */}
      <div className="trip-list flex flex-col gap-5 w-full max-w-md">
        
        <div className="trip-item p-5 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Campus → University Javeriana</h2>
          <p>Hour: 7:30 AM</p>
          <p>Status: Confirmed</p>

          <Link 
            href="/cancelar-viaje" 
            className="mt-3 inline-block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Cancel a trip
          </Link> 
        </div>

        <div className="trip-item p-5 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Campus → University Javeriana</h2>
          <p>Hour: 8:00 AM</p>
          <p>Status: Finished</p>
        </div>

      </div>

      <Link 
        href="/available-quotas" 
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        Back to available rides
      </Link>
    </div>
  );
}