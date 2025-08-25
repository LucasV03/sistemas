"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"; // ajusta ruta si usas tsconfig con alias
import Image from "next/image";

export default function Home() {
  // 👇 hooks de Convex siempre van arriba del return
  const usuarios = useQuery(api.usuarios.listar, {});
  const addUsuario = useMutation(api.usuarios.crear);

  if (usuarios === undefined) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Sistema de Transporte</h1>
      

      <div className="mt-6 grid gap-4">
        <a href="/vehiculos" className="underline">
          Gestión de Flota
        </a>
        <a href="/viajes" className="underline">
          Seguimiento de Viajes
        </a>
      </div>

      {/* Sección de usuarios */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <ul>
          {usuarios.map((u) => (
            <li key={u._id}>
              {u.nombre} - {u.email} - {u.rol} - {u.edad}
            </li>
          ))}
        </ul>
        
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() =>
            addUsuario({
              nombre: "Lucas",
              edad: 25,
              email: "lucas@lucas",
              rol: "admin",
            })
          }
        >
          Agregar usuario
        </button>
      </div>
    </main>
  );
}
