"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
export default function VehiculosPage() {
  const vehiculos = useQuery(api.vehiculos.listar, {});
  const addVehiculo = useMutation(api.vehiculos.crear);

  const [patente, setPatente] = useState("");
  const [tipo, setTipo] = useState("");
  const [capacidad, setCapacidad] = useState(0);

  if (vehiculos === undefined) {
    return <p>Cargando...</p>;
  }

  const handleAddVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patente || !tipo || capacidad <= 0) {
      alert("Completa todos los campos");
      return;
    }
    await addVehiculo({ patente, tipo, capacidad });
    setPatente("");
    setTipo("");
    setCapacidad(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Vehículos</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleAddVehiculo}
        className="bg-gray-100 p-4 rounded-xl shadow-md mb-6"
      >
        <div className="mb-3">
          <label className="block mb-1 font-medium">Patente</label>
          <input
            type="text"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="ABC123"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Camión, Auto, Moto..."
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Capacidad</label>
          <input
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="0"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Agregar Vehículo
        </button>
      </form>

      {/* LISTA DE VEHÍCULOS */}
      <ul className="space-y-2">
        {vehiculos.map((v) => (
          <li
            key={v._id}
            className="border p-3 rounded-lg flex justify-between items-center"
          >
            <span>
              <strong>{v.patente}</strong> - {v.tipo} ({v.capacidad}) -{" "}
              <span className="italic">{v.estado}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}