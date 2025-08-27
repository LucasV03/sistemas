"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";

export default function EditarRepuestoPage({ params }: { params: Promise<{ codigo: string }> }) {

  const router = useRouter();
 const { codigo } = use(params); // ✅ Se hace unwrap del Promise
    const repuesto = useQuery(api.repuestos.obtener, { codigo });
  const actualizarRepuesto = useMutation(api.repuestos.actualizarRepuesto);

  // Estados del form
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    stock: 0,
    precioUnitario: 0,
    marca: "",
    modeloCompatible: "",
    categoria: "",
    ubicacion: "",
    
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos en el form
  useEffect(() => {
    if (repuesto) {
      setForm({
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion ?? "",
        stock: repuesto.stock,
        precioUnitario: repuesto.precioUnitario ?? 0,
        marca: repuesto.marca ?? "",
        modeloCompatible: repuesto.modeloCompatible ?? "",
        categoria: repuesto.categoria ?? "",
        ubicacion: repuesto.ubicacion ?? "",
        
      });
      
    }
  }, [repuesto]);

  // Manejo de inputs de texto/numéricos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "precioUnitario" ? Number(value) : value,
    }));
  };

  // Manejo de imagen
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio ❌");
      return;
    }

    setLoading(true);

    try {
      await actualizarRepuesto({
        codigo,
        ...form,
      });

      alert("Repuesto actualizado ✅");
      router.push("/repuestos");
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (repuesto === undefined) return <p>Cargando...</p>;
  if (repuesto === null) return <p>No se encontró el repuesto</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Editar repuesto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos texto */}
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" />
        <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" />
        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded" />
        <input type="number" name="precioUnitario" value={form.precioUnitario} onChange={handleChange} placeholder="Precio" className="w-full p-2 border rounded" />
        <input type="text" name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" className="w-full p-2 border rounded" />
        <input type="text" name="modeloCompatible" value={form.modeloCompatible} onChange={handleChange} placeholder="Modelo" className="w-full p-2 border rounded" />
        <input type="text" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="w-full p-2 border rounded" />
        <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="w-full p-2 border rounded" />

     
        

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
