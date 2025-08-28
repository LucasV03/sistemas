'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useMemo, useState } from 'react';

type SortKey = 'patente' | 'tipo' | 'km' | 'capacidad' | 'estado';
type SortOrder = 'asc' | 'desc';

export default function VehiculosPage() {
  const vehiculos = useQuery(api.vehiculos.listar);
  const addVehiculo = useMutation(api.vehiculos.crear);

  const [patente, setPatente] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState<string>('');

  // ➜ Estado de orden
  const [sortKey, setSortKey] = useState<SortKey>('patente');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const loading = vehiculos === undefined;
  const data = vehiculos ?? [];

  const DEFAULTS: Record<string, number> = { Colectivo: 10000, Camion: 15000, Trafic: 8000 };

  const formatKm = (n: number) =>
    new Intl.NumberFormat('es-AR').format(Math.max(0, Math.round(n)));

  function calcNextService(v: any) {
    const currentKm = Number.isFinite(v?.km) ? Number(v.km) : 0;
    const lastKm = Number.isFinite(v?.ultimoServiceKm) ? Number(v.ultimoServiceKm) : currentKm;
    const interval = Number.isFinite(v?.serviceIntervalKm)
      ? Number(v.serviceIntervalKm)
      : (DEFAULTS[v?.tipo] ?? 10000);
    const nextAtKm = lastKm + interval;
    const remaining = nextAtKm - currentKm;
    let tone: 'ok' | 'warn' | 'due' = 'ok';
    if (remaining <= 0) tone = 'due';
    else if (remaining <= interval * 0.1) tone = 'warn';
    return { nextAtKm, remaining, tone };
  }

  // ➜ Ordenamiento en memoria
  const sortedData = useMemo(() => {
    const toStr = (v: any) => String(v ?? '').toUpperCase();
    const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

    return [...data].sort((a: any, b: any) => {
      let A: any;
      let B: any;

      if (sortKey === 'km' || sortKey === 'capacidad') {
        A = toNum(a[sortKey]);
        B = toNum(b[sortKey]);
      } else if (sortKey === 'estado') {
        // estado puede venir null/undefined → tratamos como cadena
        A = toStr(a.estado ?? '-');
        B = toStr(b.estado ?? '-');
      } else {
        A = toStr(a[sortKey]);
        B = toStr(b[sortKey]);
      }

      const cmp = A < B ? -1 : A > B ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortOrder]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  async function handleAddVehiculo(e: React.FormEvent) {
    e.preventDefault();
    const capNum = Number(capacidad);
    if (!patente.trim() || !tipo || !Number.isFinite(capNum) || capNum <= 0) {
      alert('Completá patente, tipo y una capacidad válida (>0).');
      return;
    }
    try {
      await addVehiculo({
        patente: patente.trim().toUpperCase().replace(/\s+/g, ''),
        tipo,
        capacidad: Math.floor(capNum),
      } as any);
      setPatente(''); setTipo(''); setCapacidad('');
    } catch (err: any) {
      console.error(err);
      alert(`Error al crear vehículo: ${err?.message ?? 'Ver consola de Convex'}`);
    }
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <section className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-3xl font-semibold mb-7 mt-3 text-neutral-100">Vehículos</h2>

        {loading ? (
          <p className="text-neutral-400">Cargando vehículos...</p>
        ) : sortedData.length === 0 ? (
          <p className="text-rose-400">No hay vehículos registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-700">
            <table className="min-w-full table-fixed">
              <thead className="bg-slate-800 text-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('patente')}>
                    Patente{arrow('patente')}
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('tipo')}>
                    Tipo{arrow('tipo')}
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('capacidad')}>
                    Capacidad{arrow('capacidad')}
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('estado')}>
                    Estado{arrow('estado')}
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('km')}>
                    Kilometraje{arrow('km')}
                  </th>
                  <th className="px-4 py-2 text-left">Último mantenimiento</th>
                  <th className="px-4 py-2 text-left">Próximo service</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-200">
                {sortedData.map((v: any) => {
                  const info = calcNextService(v);
                  const badge =
                    info.tone === 'ok'
                      ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                      : info.tone === 'warn'
                      ? 'bg-amber-100 text-amber-700 ring-amber-200'
                      : 'bg-rose-100 text-rose-700 ring-rose-200';
                  return (
                    <tr key={v._id} className="odd:bg-neutral-900 even:bg-neutral-800 hover:bg-neutral-700">
                      <td className="px-4 py-2 border-t">{v.patente}</td>
                      <td className="px-4 py-2 border-t capitalize">{v.tipo}</td>
                      <td className="px-4 py-2 border-t">{v.capacidad}</td>
                      <td className="px-4 py-2 border-t capitalize">{v.estado ?? '-'}</td>
                      <td className="px-4 py-2 border-t">{formatKm(v.km ?? 0)}</td>
                      <td className="px-4 py-2 border-t">{v.FechaUltimoMantenimiento || '-'}</td>
                      <td className="px-4 py-2 border-t">
                        <div className="flex flex-col">
                          <span className={`w-fit rounded-full px-2 py-0.5 text-xs ring-1 ${badge}`}>
                            Próx. a los {formatKm(info.nextAtKm)} km
                          </span>
                          <span className="text-xs text-neutral-400 mt-1">
                            {info.remaining >= 0
                              ? `faltan ${formatKm(info.remaining)} km`
                              : `vencido por ${formatKm(Math.abs(info.remaining))} km`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulario alta */}
        <div className="mt-12 mb-10 w-full max-w-lg mx-auto bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <form onSubmit={handleAddVehiculo} className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-100">Agregar vehículo</h3>

            <input
              type="text"
              placeholder="Patente"
              className="border bg-neutral-900 border-neutral-700 rounded px-3 py-2 w-full"
              value={patente}
              onChange={(e) => setPatente(e.target.value)}
              required
            />

            <select
              className="border bg-neutral-900 border-neutral-700 rounded px-3 py-2 w-full"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Colectivo">Colectivo</option>
              <option value="Camion">Camión</option>
              <option value="Trafic">Trafic</option>
            </select>

            <input
              type="number"
              placeholder="Capacidad"
              className="border bg-neutral-900 border-neutral-700 rounded px-3 py-2 w-full"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              required
              min={1}
            />

            <button type="submit" className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
              Agregar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
