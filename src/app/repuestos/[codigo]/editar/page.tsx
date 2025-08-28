"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";

export default function EditarRepuestoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const router = useRouter();
  const { codigo } = use(params); // ✅ unwrap Promise
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
      [name]:
        name === "stock" || name === "precioUnitario" ? Number(value) : value,
    }));
  };

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
    <main className="p-6 max-w-3xl mx-auto">
      <article className="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          ✏️ Editar repuesto
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-5">
            <Field label="Nombre">
              <Input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </Field>
            <Field label="Descripción" className="flex-1 min-w-[250px]">
              <Input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </Field>
            <Field label="Precio Unitario">
              <Input
                type="number"
                name="precioUnitario"
                value={form.precioUnitario}
                onChange={handleChange}
                required
              />
            </Field>
            <Field label="Marca">
              <Input
                name="marca"
                value={form.marca}
                onChange={handleChange}
              />
            </Field>
            <Field label="Modelo Compatible">
              <Input
                name="modeloCompatible"
                value={form.modeloCompatible}
                onChange={handleChange}
              />
            </Field>
            <Field label="Categoría">
              <Input
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              />
            </Field>
            <Field label="Ubicación">
              <Input
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* Botón */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg text-white font-semibold shadow transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </article>
    </main>
  );
}

/* Helpers */
function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col flex-1 min-w-[200px] ${className}`}>
      <label className="text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      {...props}
      className="border rounded-lg px-3 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  );
}
