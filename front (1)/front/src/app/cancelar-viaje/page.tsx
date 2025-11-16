import Link from "next/link";

export default function CancelarViaje() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
    
      <h1 className="text-2xl font-semibold italic text-black mb-8">
        Are you sure to <br /> cancel this trip?
      </h1>

   
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link href="/confirmar-cancelacion" className="bg-blue-900 text-white py-2 rounded-xl font-medium hover:bg-blue-800 transition" >
          Yes
        </Link>

        <Link
          href="/my-trips"
          className="bg-blue-900 text-white py-2 rounded-xl font-medium text-center hover:bg-blue-800 transition"
        >
          No
        </Link>
      </div>
    </div>
  );
}
