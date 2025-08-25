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
      
      
    });
   
    setNombre("");
    setEmail("");
    setRol("chofer");
    
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      
      {/* Usuarios */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold m-4">Usuarios</h2>

        {usuarios.length === 0 ? (
          <p className="text-red-500">No hay usuarios registrados.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-5 py-2">Nombre</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Rol</th>
                
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{u.nombre}</td>
                  <td className="border px-3 py-2">{u.email}</td>
                  <td className="border px-3 py-2 capitalize">{u.rol}</td>
                  
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
            <option value="Admin">Admin</option>
            <option value="Chofer">Chofer</option>
            <option value="Mecanico">Mecanico</option>
          </select>

          

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
