import Link from "next/link"; 
import Image from "next/image";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      
      {/* Imagen */}
      <div className="mb-4">
        <Image
          src="/driver.png.png"
          alt="Driver icon"
          width={120}
          height={120}
        />
      </div>

      {/* Título */}
      <h1 className="text-xl font-semibold mb-6">Driver</h1>

      {/* Formulario */}
      <form className="w-full max-w-sm flex flex-col space-y-4">

        <button 
          type="button" 
          className="border border-gray-300 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <button 
          type="button" 
          className="bg-blue-700 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Continue with Facebook
        </button>

        <div className="text-center text-gray-500 text-sm">or</div>

        <input 
          type="email" 
          placeholder="Email" 
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input 
          type="password" 
          placeholder="Password" 
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Link 
          href="/registro-conductor"
          className="bg-blue-900 text-white py-2 rounded-lg shadow hover:bg-blue-800 transition text-center"
        >
          Continue
        </Link>
      </form>

      {/* Texto inferior */}
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
