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
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500">Cargando vehículos...</p>
      </main>
    );
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
    <main className="p-6 max-w-6xl mx-auto">
      {/* Vehículos */}
      <section className="bg-white rounded-xl p-6 shadow-xl/30">
        <h2 className="text-3xl font-semibold mb-7 mt-3">Vehículos</h2>

        {/* Listado con scroll */}
        {vehiculos.length === 0 ? (
          <p className="text-red-600 pl-7">No hay vehículos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            {/* Header fijo */}
            <table className="min-w-full table-fixed border">
              <thead className="bg-blue-600 text-white">
                <tr className="text-left">
                  <th className="px-3 py-2 ">Patente</th>
                  <th className="px-30 py-2">Tipo</th>
                  <th className="px-3 py-2 w-1/5 ">Capacidad</th>
                  <th className="px-3 py-2 w-1/8 ">Estado</th>
                  <th className="px-1/5 py-2 w-1/9 ">Kilometraje</th>
                  <th className="px-3 py-2 w-1/3 ">Último mantenimiento</th>
                </tr>
              </thead>
            </table>

            {/* Body con scroll */}
            <div className="h-[192px] overflow-y-auto border-b">
              <table className="min-w-full table-fixed">
                <tbody className="bg-white">
                  {vehiculos.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 h-12 w-1/5 border">{v.patente}</td>
                      <td className="px-3 py-2 h-12 w-1/7 border capitalize">{v.tipo}</td>
                      <td className="px-3 py-2 w-1/6 h-12 border">{v.capacidad}</td>
                      <td className="px-3 py-2 h-12 w-1/9 border capitalize">{v.estado}</td>
                      <td className="px-3 py-2 h-12 w-1/9 border">{v.km}</td>
                      <td className="px-3 py-2 h-12 w-1/3 border">{v.FechaUltimoMantenimiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formulario abajo en otro bloque */}
        <div className="mt-12 ml-64 mb-10 w-100 shadow-xl/34 bg-gray-200 rounded-xl p-4">
          <form onSubmit={handleAddVehiculo} className="space-y-3">
            <h3 className="text-lg font-bold">Agregar vehículo</h3>

            <input
              type="text"
              placeholder="Patente"
              className="border rounded px-3 py-2 w-full"
              value={patente}
              onChange={(e) => setPatente(e.target.value)}
              required
            />

            <select
              className="border rounded px-3 py-2 w-full"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Colectivo">Colectivo</option>
              <option value="Camion">Camión</option>
              <option value="Trafic">Trafic</option>
            </select>

            <h5 className="text-lg text-font-semibold ">Capacidad</h5>
            <input

              type="number"
              placeholder="Capacidad"
              className="border rounded px-3 py-2 w-full"
              value={capacidad}
              onChange={(e) => setCapacidad(Number(e.target.value))}
              required
              
            />

            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Agregar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
