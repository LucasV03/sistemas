"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
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
      <h1 className="text-2xl font-bold mb-4 text-white">Agregar Vehiculo</h1>

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

        <select
            className="border rounded px-3 py-2 w-full"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="Seleccionar">Seleccionar</option>
            <option value="Colectivo">Colectivo</option>
            <option value="Camion">Camion</option>
            <option value="Trafic">Trafic</option>
          </select>
        

        <div className="mb-3">
          <label className="block mb-1 font-medium">Capacidad</label>
          <input
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
            placeholder ="Capacidad"
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
<div className="max-w-2xl mx-auto p-6">
  <h1 className="text-2xl font-bold mb-4 text-white">Vehículos</h1>

  {/* Contenedor con scroll */}
  <div className="w-full max-h-100 overflow-y-auto border rounded-lg shadow">
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200 sticky top-0">
        <tr>
          <th className="text-left p-2 border border-gray-300">Patente</th>
          <th className="text-left p-2 border border-gray-300">Tipo</th>
          <th className="text-left p-2 border border-gray-300">Capacidad</th>
          <th className="text-left p-2 border border-gray-300">Estado</th>
          <th className="text-left p-2 border border-gray-300">Kilometraje</th>
          <th className="text-left p-2 border border-gray-300">Último mantenimiento</th>
        </tr>
      </thead>
      <tbody>
        {vehiculos.map((vehiculo) => (
          <tr key={vehiculo._id} className="odd:bg-white even:bg-gray-50">
            <td className="p-2 border border-gray-300">{vehiculo.patente}</td>
            <td className="p-2 border border-gray-300">{vehiculo.tipo}</td>
            <td className="p-2 border border-gray-300">{vehiculo.capacidad}</td>
            <td className="p-2 border border-gray-300">{vehiculo.estado}</td>
            <td className="p-2 border border-gray-300">{vehiculo.km}</td>
            <td className="p-2 border border-gray-300">{vehiculo.FechaUltimoMantenimiento}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}