import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-1 900 p-6">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        
        {/* Título */}
        <h1 className="text-3xl font-bold mb-6">CuposUniC</h1>
        
        {/* Imagen */}
        <Image 
          src="/app.png" 
          alt="University quotas" 
          width={160} 
          height={160} 
          className="mx-auto mb-6"
        />
        
        {/* Texto */}
        <p className="text-lg text-gray-700 mb-6">
          Welcome to CuposUniC, The platform for managing and reserving places at universities.
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-4">
          <a 
            href="/crear-cuenta" 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Create Account 
          </a>
          <a 
            href="/login" 
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
