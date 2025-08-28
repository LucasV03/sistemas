// src/app/repuestos/page.tsx
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
  const [sortBy, setSortBy] =
    useState<"codigo" | "nombre" | "categoria" | "vehiculo">("nombre");
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

  // HANDLER
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
      <section className="rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            📦 Repuestos
          </h2>

          {/* Ordenar */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-neutral-600 dark:text-neutral-400">
              Ordenar por:
            </label>
            <select
              className="rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="nombre">Nombre</option>
              <option value="codigo">Código</option>
              <option value="categoria">Categoría</option>
              <option value="vehiculo">Vehículo</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 px-3 py-1 text-sm"
              title="Cambiar orden"
            >
              {sortDir === "asc" ? "Ascendente ▲" : "Descendente ▼"}
            </button>
          </div>
        </div>

        {/* LISTADO */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : repuestosOrdenados.length === 0 ? (
          <p className="text-rose-600 dark:text-rose-400 font-medium">
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
        <div className="mt-12">
          <article className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-6 shadow-sm bg-gray-100 dark:bg-neutral-800 hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              ➕ Agregar repuesto
            </h3>

            <form onSubmit={handleAddRepuesto} className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-5">
                <Field label="Código">
                  <Input value={codigo} onChange={setCodigo} required />
                </Field>
                <Field label="Nombre">
                  <Input value={nombre} onChange={setNombre} required />
                </Field>
                <Field label="Descripción" className="flex-1 min-w-[250px]">
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
                  <Input
                    value={modeloCompatible}
                    onChange={setModeloCompatible}
                  />
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
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-800 text-white font-semibold rounded-lg shadow hover:bg-slate-700 transition"
                >
                  Guardar Repuesto
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  );
}

/* ---------- Helpers ---------- */

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
    <div className={`flex flex-col flex-1 min-w-[220px] ${className}`}>
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
        {label}
      </label>
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
      className="
        border border-neutral-300 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        placeholder-neutral-400 dark:placeholder-neutral-500
        caret-current
        rounded-lg px-3 py-2 w-full text-sm shadow-sm
        focus:ring-2 focus:ring-slate-500 focus:outline-none
      "
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
      className="
        border border-neutral-300 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        placeholder-neutral-400 dark:placeholder-neutral-500
        caret-current
        rounded-lg px-3 py-2 w-full text-sm shadow-sm
        focus:ring-2 focus:ring-slate-500 focus:outline-none
        resize-y
      "
      rows={3}
    />
  );
}
