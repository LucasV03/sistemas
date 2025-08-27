'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useMemo, useState } from 'react';

export default function EmpleadosPage() {
  // DATA
  const empleados = useQuery(api.empleados.listar);
  const addEmpleado = useMutation(api.empleados.crear);

  const loading = empleados === undefined;
  const data = empleados ?? [];

  // FORM
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDNI] = useState('');
  const [rol, setRol] = useState('');

  // SORT
  const [sortBy, setSortBy] =
    useState<'nombre' | 'apellido' | 'email' | 'rol'>('nombre');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const norm = (s: any) =>
    (s ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const empleadosOrdenados = useMemo(() => {
    const arr = [...data];
    const dir = sortDir === 'asc' ? 1 : -1;
    return arr.sort((a: any, b: any) => {
      const va = norm(a?.[sortBy]);
      const vb = norm(b?.[sortBy]);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [data, sortBy, sortDir]);

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(key);
      setSortDir('asc');
    }
  };
  const Arrow = () => <span>&nbsp;{sortDir === 'asc' ? '▲' : '▼'}</span>;

  // HANDLERS
  const handleAddEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmpleado({ nombre, apellido, email, dni, rol });
    setNombre(''); setApellido(''); setEmail(''); setDNI(''); setRol('');
  };

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <section className="rounded-xl bg-white p-4 md:p-6 ring-1 ring-slate-200 shadow">
        <h2 className="text-3xl font-semibold mb-4">Empleados</h2>

        {/* Controles de orden */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600 mr-2">Ordenar por:</span>
          {(['nombre', 'apellido', 'email', 'rol'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              disabled={loading}
              className={[
                'rounded-md px-3 py-1 text-sm ring-1 transition',
                sortBy === key
                  ? 'bg-blue-600 text-white ring-blue-600'
                  : 'bg-slate-50 text-slate-700 ring-slate-200 hover:bg-slate-100',
                loading ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            disabled={loading}
            className={[
              'ml-2 rounded-md px-3 py-1 text-sm ring-1 ring-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
              loading ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
            title="Cambiar ascendente/descendente"
          >
            {sortDir === 'asc' ? 'Ascendente ▲' : 'Descendente ▼'}
          </button>
        </div>

        {/* LISTADO */}
        {loading ? (
          // Skeleton simple
          <div className="space-y-2">
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
          </div>
        ) : empleadosOrdenados.length === 0 ? (
          <p className="text-red-600">No hay empleados registrados.</p>
        ) : (
          <>
            {/* Móvil: cards */}
            <div className="md:hidden space-y-2 max-h-80 overflow-y-auto">
              {empleadosOrdenados.map((u: any) => (
                <article key={u._id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-slate-900 capitalize">
                      {u.nombre} {u.apellido}
                    </h3>
                    <span className="text-xs rounded px-2 py-0.5 bg-slate-100 text-slate-700 ring-1 ring-slate-200 capitalize">
                      {u.rol}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 break-all">{u.email}</p>
                  <p className="text-xs text-slate-500 mt-1">DNI: {u.dni}</p>
                </article>
              ))}
            </div>

            {/* md+: tabla con headers clickeables y 4 filas visibles */}
            <div className="hidden md:block">
              <table className="min-w-full table-fixed">
                <thead className="bg-blue-600 text-white">
                  <tr className="text-left select-none">
                    <th
                      onClick={() => toggleSort('nombre')}
                      className="w-1/4 px-3 py-2 cursor-pointer"
                    >
                      Nombre {sortBy === 'nombre' && <Arrow />}
                    </th>
                    <th
                      onClick={() => toggleSort('apellido')}
                      className="w-1/4 px-3 py-2 cursor-pointer"
                    >
                      Apellido {sortBy === 'apellido' && <Arrow />}
                    </th>
                    <th
                      onClick={() => toggleSort('email')}
                      className="w-1/4 px-3 py-2 cursor-pointer"
                    >
                      Email {sortBy === 'email' && <Arrow />}
                    </th>
                    <th
                      onClick={() => toggleSort('rol')}
                      className="w-1/4 px-3 py-2 cursor-pointer"
                    >
                      Rol {sortBy === 'rol' && <Arrow />}
                    </th>
                  </tr>
                </thead>
              </table>

              {/* 4 filas visibles -> 4 * h-12 = 192px */}
              <div className="h-[192px] overflow-y-auto border-x border-b rounded-b">
                <table className="min-w-full table-fixed">
                  <tbody className="bg-white">
                    {empleadosOrdenados.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="w-1/4 px-3 py-2 h-12 border capitalize">{u.nombre}</td>
                        <td className="w-1/4 px-3 py-2 h-12 border capitalize">{u.apellido}</td>
                        <td className="w-1/4 px-3 py-2 h-12 border">{u.email}</td>
                        <td className="w-1/4 px-3 py-2 h-12 border capitalize">{u.rol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* FORM */}
        <div className="mt-8 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold mb-3">Agregar empleado</h3>
          <form onSubmit={handleAddEmpleado} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nombre">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Field>

            <Field label="Apellido">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Field>

            <Field label="DNI">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={dni}
                onChange={(e) => setDNI(e.target.value)}
                required
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                className="border rounded px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-600 mb-1 block">Rol</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar</option>
                <option value="Jefe">Jefe</option>
                <option value="Chofer">Chofer</option>
                <option value="Mecanico">Mecánico</option>
              </select>
            </div>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
