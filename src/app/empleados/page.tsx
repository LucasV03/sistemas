// src/app/empleados/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";

export default function EmpleadosPage() {
  // DATA
  const empleados = useQuery(api.empleados.listar);
  const addEmpleado = useMutation(api.empleados.crear);

  const loading = empleados === undefined;
  const data = empleados ?? [];

  // FORM
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDNI] = useState("");
  const [rol, setRol] = useState("");

  // SORT
  const [sortBy, setSortBy] =
    useState<"nombre" | "apellido" | "email" | "rol">("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const norm = (s: any) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const empleadosOrdenados = useMemo(() => {
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

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };
  const Arrow = () => <span>&nbsp;{sortDir === "asc" ? "▲" : "▼"}</span>;

  // HANDLERS
  const handleAddEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmpleado({ nombre, apellido, email, dni, rol });
    setNombre(""); setApellido(""); setEmail(""); setDNI(""); setRol("");
  };

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-6 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Empleados
        </h2>

        {/* Controles de orden (flex + wrap) */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400 mr-1">
            Ordenar por:
          </span>
          {(["nombre", "apellido", "email", "rol"] as const).map((key) => {
            const active = sortBy === key;
            return (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                disabled={loading}
                className={[
                  "rounded-md px-3 py-1 text-sm ring-1 transition",
                  active
                    ? "bg-slate-800 text-white ring-slate-800"
                    : "bg-neutral-50 text-neutral-700 ring-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700",
                  loading ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            );
          })}
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            disabled={loading}
            className={[
              "ml-1 rounded-md px-3 py-1 text-sm ring-1",
              "bg-neutral-50 text-neutral-700 ring-neutral-200 hover:bg-neutral-100",
              "dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700",
              loading ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
            title="Cambiar ascendente/descendente"
          >
            {sortDir === "asc" ? "Ascendente ▲" : "Descendente ▼"}
          </button>
        </div>

        {/* LISTADO */}
        {loading ? (
          // Skeleton simple
          <div className="space-y-2">
            <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
        ) : empleadosOrdenados.length === 0 ? (
          <p className="text-rose-600 dark:text-rose-400">
            No hay empleados registrados.
          </p>
        ) : (
          <>
            {/* Móvil: cards scrolleables */}
            <div className="md:hidden space-y-2 max-h-80 overflow-y-auto">
              {empleadosOrdenados.map((u: any) => (
                <article
                  key={u._id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                      {u.nombre} {u.apellido}
                    </h3>
                    <span className="text-xs rounded px-2 py-0.5 bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700 capitalize">
                      {u.rol}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 break-all">
                    {u.email}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    DNI: {u.dni}
                  </p>
                </article>
              ))}
            </div>

            {/* md+: tabla con headers clickeables y 4 filas visibles */}
            <div className="hidden md:block">
              <table className="min-w-full table-fixed">
                <thead className="bg-slate-800 text-white">
                  <tr className="text-left select-none">
                    <Th onClick={() => toggleSort("nombre")}>
                      Nombre {sortBy === "nombre" && <Arrow />}
                    </Th>
                    <Th onClick={() => toggleSort("apellido")}>
                      Apellido {sortBy === "apellido" && <Arrow />}
                    </Th>
                    <Th onClick={() => toggleSort("email")}>
                      Email {sortBy === "email" && <Arrow />}
                    </Th>
                    <Th onClick={() => toggleSort("rol")}>
                      Rol {sortBy === "rol" && <Arrow />}
                    </Th>
                  </tr>
                </thead>
              </table>

              {/* 4 filas visibles -> 4 * h-12 = 192px */}
              <div className="h-[192px] overflow-y-auto border-x border-b rounded-b border-neutral-200 dark:border-neutral-800">
                <table className="min-w-full table-fixed">
                  <tbody className="bg-white dark:bg-neutral-900">
                    {empleadosOrdenados.map((u: any) => (
                      <tr key={u._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <Td className="capitalize">{u.nombre}</Td>
                        <Td className="capitalize">{u.apellido}</Td>
                        <Td>{u.email}</Td>
                        <Td className="capitalize">{u.rol}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* FORM (flex + wrap) */}
        <div className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            Agregar empleado
          </h3>

          <form onSubmit={handleAddEmpleado} className="flex flex-wrap gap-3">
            <Field label="Nombre" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="text"
                className="
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  caret-current
                  rounded px-3 py-2 w-full
                "
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Field>

            <Field label="Apellido" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="text"
                className="
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  caret-current
                  rounded px-3 py-2 w-full
                "
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Field>

            <Field label="DNI" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="text"
                className="
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  caret-current
                  rounded px-3 py-2 w-full
                "
                value={dni}
                onChange={(e) => setDNI(e.target.value)}
                required
              />
            </Field>

            <Field label="Email" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="email"
                className="
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  caret-current
                  rounded px-3 py-2 w-full
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Rol" className="flex-1 basis-full min-w-[220px]">
              <select
                className="
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  caret-current
                  rounded px-3 py-2 w-full
                "
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar</option>
                <option value="Jefe">Jefe</option>
                <option value="Chofer">Chofer</option>
                <option value="Mecanico">Mecánico</option>
              </select>
            </Field>

            <div className="basis-full">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
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

/* ---------- UI helpers ---------- */

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="w-1/4 px-3 py-2 cursor-pointer select-none"
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={["w-1/4 px-3 py-2 h-12 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200", className].join(" ")}>
      {children}
    </td>
  );
}

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
    <div className={["flex flex-col", className].join(" ")}>
      <label className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
