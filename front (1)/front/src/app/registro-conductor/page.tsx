import Link from "next/link";

export default function RegistroConductor() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 p-6">
      <div className="container text-center max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Car license plate"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Car Brand"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="City"
            required
            className="w-full border px-3 py-2 rounded-md"
          />

        <Link
            href="/confir-conductor"
            className="block text-center w-full bg-[#001F54] text-white py-2 px-4 rounded-md hover:bg-[#003366] transition-colors"
          >
            Finalize
          </Link>
        </form>
      </div>
    </main>
  );
}