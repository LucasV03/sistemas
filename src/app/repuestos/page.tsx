"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";
import RepuestoCard from "../../components/RepuestoCard";
import { useRouter } from "next/navigation";

export default function RepuestosPage() {
  // DATA
  const repuestos = useQuery(api.repuestos.listar);
  const addRepuesto = useMutation(api.repuestos.crear);
  const eliminarRepuesto = useMutation(api.repuestos.eliminar);
  const router = useRouter();

  const loading = repuestos === undefined;
  const data = repuestos ?? [];

  // FORM
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [marca, setMarca] = useState("");
  const [modeloCompatible, setModeloCompatible] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");

  // SORT
  const [sortBy, setSortBy] = useState<
    "codigo" | "nombre" | "categoria" | "vehiculo"
  >("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const norm = (s: any) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const repuestosOrdenados = useMemo(() => {
    const arr = [...data];
    const dir = sortDir === "asc" ? 1 : -1;
    return arr.sort((a: any, b: any) => {
      const va = norm(a?.[sortBy]);
      const vb = norm(b?.[sortBy]);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [data, sortBy, sortDir]);

  // HANDLERS
  const handleAddRepuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRepuesto({
      codigo,
      nombre,
      descripcion,
      categoria,
      vehiculo,
      marca,
      modeloCompatible,
      stock,
      precioUnitario,
      ubicacion,
      fechaIngreso: fechaIngreso || new Date().toISOString(),
    });

    // limpiar form
    setCodigo("");
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setVehiculo("");
    setMarca("");
    setModeloCompatible("");
    setStock(0);
    setPrecioUnitario(0);
    setUbicacion("");
    setFechaIngreso("");
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">
      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">📦 Repuestos</h2>

        {/* LISTADO */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : repuestosOrdenados.length === 0 ? (
          <p className="text-red-600 font-medium">
            ⚠️ No hay repuestos registrados.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repuestosOrdenados.map((r: any) => (
              <RepuestoCard
                key={r._id}
                repuesto={r}
                onUpdate={() => router.push(`/repuestos/${r.codigo}/editar`)}
                onDelete={() => eliminarRepuesto({ id: r._id })}
              />
            ))}
          </div>
        )}

        {/* FORM */}
        <div className="mt-12 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200 shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">
            ➕ Agregar repuesto
          </h3>
          <form
            onSubmit={handleAddRepuesto}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <Field label="Código">
              <Input value={codigo} onChange={setCodigo} required />
            </Field>
            <Field label="Nombre">
              <Input value={nombre} onChange={setNombre} required />
            </Field>
            <Field label="Descripción">
              <Textarea value={descripcion} onChange={setDescripcion} />
            </Field>
            <Field label="Categoría">
              <Input value={categoria} onChange={setCategoria} required />
            </Field>
            <Field label="Vehículo">
              <Input value={vehiculo} onChange={setVehiculo} required />
            </Field>
            <Field label="Marca">
              <Input value={marca} onChange={setMarca} />
            </Field>
            <Field label="Modelo Compatible">
              <Input value={modeloCompatible} onChange={setModeloCompatible} />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                value={stock}
                onChange={setStock}
                required
              />
            </Field>
            <Field label="Precio Unitario">
              <Input
                type="number"
                value={precioUnitario}
                onChange={setPrecioUnitario}
                required
              />
            </Field>
            <Field label="Ubicación">
              <Input value={ubicacion} onChange={setUbicacion} />
            </Field>
            <Field label="Fecha Ingreso">
              <Input
                type="date"
                value={fechaIngreso}
                onChange={setFechaIngreso}
              />
            </Field>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
              >
                Guardar Repuesto
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

/* Helpers */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({
  type = "text",
  value,
  onChange,
  required = false,
}: {
  type?: string;
  value: any;
  onChange: (val: any) => void;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      required={required}
      className="border rounded-lg px-3 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  );
}
