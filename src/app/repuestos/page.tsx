'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";

export default function RepuestosPage() {
  // DATA
  const repuestos = useQuery(api.repuestos.listar);
  const addRepuesto = useMutation(api.repuestos.crear);
  const eliminarRepuesto = useMutation(api.repuestos.eliminar);

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
  const [imagenUrl, setImagenUrl] = useState("");
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
      imagenUrl,
      fechaIngreso: fechaIngreso || new Date().toISOString(),
    });
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
    setImagenUrl("");
    setFechaIngreso("");
  };

  

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <section className="rounded-xl bg-white p-4 md:p-6 ring-1 ring-slate-200 shadow">
        <h2 className="text-3xl font-semibold mb-4">Repuestos</h2>

        {/* LISTADO */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : repuestosOrdenados.length === 0 ? (
          <p className="text-red-600">No hay repuestos registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {repuestosOrdenados.map((r: any) => (
              <article
                key={r._id}
                className="border rounded-lg p-4 shadow-sm bg-slate-50 hover:shadow-md transition"
              >
                {r.imagenUrl && (
                  <img
                    src={r.imagenUrl}
                    alt={r.nombre}
                    className="w-full h-32 object-contain mb-2 rounded"
                  />
                )}
                <h3 className="text-lg font-semibold text-slate-900">{r.nombre}</h3>
                <p className="text-sm text-slate-600 mb-1">{r.descripcion}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p><b>Código:</b> {r.codigo}</p>
                  <p><b>Categoría:</b> {r.categoria}</p>
                  <p><b>Vehículo:</b> {r.vehiculo}</p>
                  <p><b>Marca:</b> {r.marca}</p>
                  <p><b>Modelo:</b> {r.modeloCompatible}</p>
                  <p><b>Stock:</b> {r.stock}</p>
                  <p><b>Precio:</b> ${r.precioUnitario}</p>
                  <p><b>Ubicación:</b> {r.ubicacion}</p>
                  <p><b>Ingreso:</b> {new Date(r.fechaIngreso).toLocaleDateString()}</p>
                </div>
                
              </article>
            ))}
          </div>
        )}

        {/* FORM */}
        <div className="mt-8 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold mb-3">Agregar repuesto</h3>
          <form
            onSubmit={handleAddRepuesto}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <Field label="Código">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Nombre">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Descripción">
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <Field label="Categoría">
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Vehículo">
              <input
                type="text"
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Marca">
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <Field label="Modelo Compatible">
              <input
                type="text"
                value={modeloCompatible}
                onChange={(e) => setModeloCompatible(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Precio Unitario">
              <input
                type="number"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </Field>
            <Field label="Ubicación">
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <Field label="URL de imagen">
              <input
                type="text"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <Field label="Fecha Ingreso">
              <input
                type="date"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </Field>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
