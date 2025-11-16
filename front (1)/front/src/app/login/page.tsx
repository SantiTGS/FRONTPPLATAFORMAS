import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* Logo */}
      <div className="mb-4">
        <Image 
          src="/app.png"  
          alt="University quotas"
          width={120} 
          height={120} 
        />
      </div>

      <h1 className="text-xl font-semibold mb-6">Login</h1>

      {/* Formulario */}
      <form className="w-full max-w-sm flex flex-col space-y-4">
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

        <div className="text-right text-sm">
          <Link href="/recuperar-clave" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>

        <button 
          type="submit" 
          className="bg-blue-900 text-white py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          Continue
        </button>
      </form>

      <p className="mt-4 text-sm">
        You don’t have an account?{" "}
        <Link href="/crear-cuenta" className="text-blue-600 font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}

