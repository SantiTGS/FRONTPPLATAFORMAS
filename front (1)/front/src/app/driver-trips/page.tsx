import Link from "next/link";

export default function DriverQuotas() {
  const quotas = [
    {
      ciudad: "Palmira",
      fecha: "3 AUGUST 2025",
      viajes: [
        { zona: "Unicentro", hora: "9:30" },
        { zona: "Javeriana", hora: "11:00" },
      ],
    },
    {
      ciudad: "Cali",
      fecha: "5 AUGUST 2025",
      viajes: [
        { zona: "Versalles", hora: "8:30" },
        { zona: "Icesi", hora: "10:00" },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Your quotas
      </h1>

      <div className="w-full max-w-md flex flex-col gap-6 mb-8">
        {quotas.map((q) => (
          <div
            key={q.ciudad}
            className="border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800">{q.ciudad}</h2>
            <p className="text-sm text-gray-500 mb-4">{q.fecha}</p>

            <div className="flex flex-col gap-3">
              {q.viajes.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <span className="text-xl">📍</span>

                  <div className="flex flex-col">
                    <p className="text-gray-800 font-medium">{v.zona}</p>
                    <p className="text-gray-500 text-sm">{v.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/create-trip"
        className="bg-black text-white py-3 rounded-lg shadow-md hover:bg-gray-800 transition w-full max-w-md text-center"
      >
        + Create new quota
      </Link>
    </div>
  );
}
