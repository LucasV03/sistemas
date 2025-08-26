"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const empleados = useQuery(api.empleados.listar, {});
  const addEmpleado = useMutation(api.empleados.crear);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDNI] = useState("");
  const [rol, setRol] = useState("");
  

  if (empleados === undefined) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500">Cargando usuarios...</p>
      </main>
    );
  }

  const handleAddUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmpleado({
      nombre,
      apellido,
      email,
      dni,
      rol,
      
      
    });
   
    setNombre("");
    setApellido("");
    setEmail("");
    setDNI("");
    setRol("");
    
  };

  return (
    <main className="p-6 max-w-5xl h-2 mx-auto">
      
      {/* Usuarios */}
      <section className=" bg-white rounded-xl p-3 shadow-xl/30">
  <h2 className="text-3xl font-semibold mb-7 mt-3 pl- ">Empleados</h2>

  {/* Listado con scroll */}
{empleados.length === 0 ? (
  <p className="text-red-600 pl-7">No hay empleados registrados.</p>
) : (
  <div className="overflow-x-auto">
    {/* Header fijo */}
    <table className="min-w-full table-fixed border">
      <thead className="bg-blue-600 text-white">
        <tr className="text-left">
          <th className="w-1/3 px-3 py-2">Nombre</th>
          <th className="w-1/3 px-3 py-2">Apellido</th>
          <th className="w-1/3 px-3 py-2">Email</th>
          <th className="w-1/3 px-3 py-2">Rol</th>
        </tr>
      </thead>
    </table>

    {/* Body con scroll y altura para 4 filas */}
    <div className="h-[192px] overflow-y-auto  border-b">
      <table className="min-w-full table-fixed">
        <tbody className="bg-white">
          {empleados.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="w-1/3 px-3 py-2 h-12 border capitalize">{u.nombre}</td>
              <td className="w-1/3 px-3 py-2 h-12 border capitalize">{u.apellido}</td>
              <td className="w-1/3 px-3 py-2 h-12 border">{u.email}</td>
              <td className="w-1/3 px-3 py-2 h-12 border capitalize">{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


  {/* Formulario abajo en otro bloque */}
  <div className="mt-12 ml-64 mb-10 w-100  shadow-xl/34   bg-gray-200 rounded-xl p-4  ">
    <form onSubmit={handleAddUsuario} className="space-y-3">
      <h3 className="text-lg  font-bold">Agregar empleado</h3>

      <input
        type="text"
        placeholder="Nombre"
        className="border rounded px-3 py-2 w-full "
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Apellido"
        className="border rounded px-3 py-2 w-full"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="DNI"
        className="border rounded px-3 py-2 w-full"
        value={dni}
        onChange={(e) => setDNI(e.target.value)}
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
            <option value="Seleccionar">Seleccionar</option>
            <option value="Jefe">Jefe</option>
            <option value="Chofer">Chofer</option>
            <option value="Mecanico">Mecanico</option>
          </select>

          

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