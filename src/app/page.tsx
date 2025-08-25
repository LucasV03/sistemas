"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const usuarios = useQuery(api.usuarios.listar, {});
  const addUsuario = useMutation(api.usuarios.crear);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("chofer");
  const [edad, setEdad] = useState("");

  if (usuarios === undefined) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500">Cargando usuarios...</p>
      </main>
    );
  }

  const handleAddUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUsuario({
      nombre,
      email,
      rol,
      edad: edad ? parseInt(edad) : 0, 
      
    });
   
    setNombre("");
    setEmail("");
    setRol("chofer");
    setEdad("");
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🚍 Sistema de Transporte</h1>

      <nav className="flex gap-6 mb-8 text-blue-600 underline">
        <a href="/vehiculos">Gestión de Flota</a>
        <a href="/viajes">Seguimiento de Viajes</a>
      </nav>

      {/* Usuarios */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

        {usuarios.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Nombre</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Rol</th>
                <th className="border px-3 py-2">Edad</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{u.nombre}</td>
                  <td className="border px-3 py-2">{u.email}</td>
                  <td className="border px-3 py-2 capitalize">{u.rol}</td>
                  <td className="border px-3 py-2">{u.edad ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulario */}
        <form onSubmit={handleAddUsuario} className="mt-6 space-y-3">
          <h3 className="text-lg font-medium">Agregar usuario</h3>

          <input
            type="text"
            placeholder="Nombre"
            className="border rounded px-3 py-2 w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <select
            className="border rounded px-3 py-2 w-full"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="chofer">Chofer</option>
            <option value="chofer">Mecanico</option>
            <option value="chofer">nacho</option>
            <option value="chofer">pepers
            </option>


          </select>

          <input
            type="number"
            placeholder="Edad"
            className="border rounded px-3 py-2 w-full"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />

          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </form>
      </section>
    </main>
  );
}
