"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ListaDeClientes() {
  const [busqueda, setBusqueda] = useState("");
  const clientes = useQuery(api.clientes.listar, { busqueda }) ?? [];

  return (
    <div className="p-8 bg-black min-h-screen text-white space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Clientes</h1>
        <p className="text-gray-300">Listado y acceso al detalle de cada cliente.</p>
      </header>

      {/* Barra de búsqueda + botón nuevo */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          className="bg-white border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500 w-full md:max-w-md"
          placeholder="Buscar por nombre, correo o empresa…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Link
          href="/clientes/nuevo"
          className="px-4 py-2 rounded bg-white text-black font-semibold hover:bg-gray-200 inline-flex items-center justify-center"
        >
          + Nuevo cliente
        </Link>
      </div>

      {/* Tarjetas de clientes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientes.map((c: any) => (
          <article key={c._id} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2 text-black">
            <h2 className="text-lg font-semibold">{c.nombre}</h2>
            <div className="text-gray-700 text-sm">
              {c.correo}
              {c.empresa ? ` • ${c.empresa}` : ""}
              {c.telefono ? ` • ${c.telefono}` : ""}
            </div>
            {c.notas && <p className="text-gray-700 line-clamp-3">{c.notas}</p>}
            <div className="mt-2">
              <Link
                className="underline font-medium hover:no-underline"
                href={`/clientes/${c._id}`}
              >
                Abrir
              </Link>
            </div>
          </article>
        ))}
      </div>

      {clientes.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-black">
          No se encontraron clientes con ese criterio.
        </div>
      )}
    </div>
  );
}
