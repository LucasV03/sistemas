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
        <p className="text-neutral-500 dark:text-neutral-400">
          Cargando vehículos...
        </p>
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
      <section className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-3xl font-semibold mb-7 mt-3 text-neutral-900 dark:text-neutral-100">
          Vehículos
        </h2>

        {/* Listado */}
        {vehiculos.length === 0 ? (
          <p className="text-rose-600 dark:text-rose-400 pl-7">
            No hay vehículos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-300 dark:border-neutral-700">
            <table className="min-w-full table-fixed">
              <thead className="bg-slate-800 text-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Patente</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Capacidad</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Kilometraje</th>
                  <th className="px-4 py-2 text-left">Último mantenimiento</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-800 dark:text-neutral-200">
                {vehiculos.map((v: any) => (
                  <tr
                    key={v._id}
                    className="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700">
                      {v.patente}
                    </td>
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700 capitalize">
                      {v.tipo}
                    </td>
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700">
                      {v.capacidad}
                    </td>
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700 capitalize">
                      {v.estado}
                    </td>
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700">
                      {v.km}
                    </td>
                    <td className="px-4 py-2 border-t border-neutral-300 dark:border-neutral-700">
                      {v.FechaUltimoMantenimiento}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulario centrado */}
        <div className="mt-12 mb-10 w-full max-w-lg mx-auto shadow-xl/34 bg-gray-200 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <form onSubmit={handleAddVehiculo} className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Agregar vehículo
            </h3>

            <input
              type="text"
              placeholder="Patente"
              className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 caret-current rounded px-3 py-2 w-full"
              value={patente}
              onChange={(e) => setPatente(e.target.value)}
              required
            />

            <select
              className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Colectivo">Colectivo</option>
              <option value="Camion">Camión</option>
              <option value="Trafic">Trafic</option>
            </select>

            <div>
              <label className="block text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                placeholder="Capacidad"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 caret-current rounded px-3 py-2 w-full"
                value={capacidad}
                onChange={(e) => setCapacidad(Number(e.target.value))}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            >
              Agregar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
