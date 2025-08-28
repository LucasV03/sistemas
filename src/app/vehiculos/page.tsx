'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useMemo, useState } from 'react';

type SortKey = 'patente' | 'tipo' | 'km' | 'capacidad' | 'estado';
type SortOrder = 'asc' | 'desc';

export default function VehiculosPage() {
  const vehiculos = useQuery(api.vehiculos.listar);
  const addVehiculo = useMutation(api.vehiculos.crear);
  const registrarMantenimiento = useMutation(api.vehiculos.registrarMantenimiento);

  const [patente, setPatente] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState<string>('');
  const [km, setKm] = useState<string>(''); // 👈 nuevo
  const [busyId, setBusyId] = useState<string | null>(null);

  // Orden
  const [sortKey, setSortKey] = useState<SortKey>('patente');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const loading = vehiculos === undefined;
  const data = vehiculos ?? [];

  const DEFAULTS: Record<string, number> = { Colectivo: 10000, Camion: 15000, Trafic: 8000 };
  const formatKm = (n: number) => new Intl.NumberFormat('es-AR').format(Math.max(0, Math.round(n)));

  function calcNextService(v: any) {
    const currentKm = Number.isFinite(v?.km) ? Number(v.km) : 0;
    const interval = Number.isFinite(v?.serviceIntervalKm)
      ? Number(v?.serviceIntervalKm)
      : (DEFAULTS[v?.tipo] ?? 10000);
    const lastKm = Number.isFinite(v?.ultimoServiceKm) ? Number(v.ultimoServiceKm) : 0;
    const nextAtKm = lastKm + interval;
    const remaining = nextAtKm - currentKm;

    let tone: 'ok' | 'warn' | 'due' = 'ok';
    if (remaining <= 0) tone = 'due';
    else if (remaining <= interval * 0.1) tone = 'warn';

    return { nextAtKm, remaining, tone };
  }

  const sortedData = useMemo(() => {
    const toStr = (v: any) => String(v ?? '').toUpperCase();
    const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    return [...data].sort((a: any, b: any) => {
      let A: any, B: any;
      if (sortKey === 'km' || sortKey === 'capacidad') { A = toNum(a[sortKey]); B = toNum(b[sortKey]); }
      else if (sortKey === 'estado') { A = toStr(a.estado ?? '-'); B = toStr(b.estado ?? '-'); }
      else { A = toStr(a[sortKey]); B = toStr(b[sortKey]); }
      const cmp = A < B ? -1 : A > B ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortOrder]);

  const displayData = sortedData.slice(0, 8);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortOrder('asc'); }
  }
  const arrow = (key: SortKey) => (sortKey === key ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : '');

  function todayLocalISO(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async function handleAddVehiculo(e: React.FormEvent) {
    e.preventDefault();
    const capNum = Number(capacidad);
    const kmNum = Number(km);
    if (
      !patente.trim() || !tipo ||
      !Number.isFinite(capNum) || capNum <= 0 ||
      !Number.isFinite(kmNum) || kmNum < 0
    ) {
      alert('Completá todos los campos con valores válidos.');
      return;
    }
    try {
      await addVehiculo({
        patente: patente.trim().toUpperCase().replace(/\s+/g, ''),
        tipo,
        capacidad: Math.floor(capNum),
        km: Math.floor(kmNum), // 👈 ahora se envía
      } as any);
      setPatente(''); setTipo(''); setCapacidad(''); setKm('');
    } catch (err: any) {
      console.error(err);
      alert(`Error al crear vehículo: ${err?.message ?? 'Ver consola de Convex'}`);
    }
  }

  async function handleRegistrarMantenimiento(v: any) {
    try {
      setBusyId(v._id);
      const fecha = todayLocalISO();
      const kmActual = Number.isFinite(v?.km) ? Math.floor(v.km) : 0;
      await registrarMantenimiento({ vehiculoId: v._id, fecha, km: kmActual });
    } catch (err: any) {
      console.error(err);
      alert(`No se pudo registrar mantenimiento: ${err?.message ?? 'ver consola'}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto">
      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-6 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Vehículos
        </h2>

        {/* ===== Tabla desktop ===== */}
        {!loading && displayData.length > 0 && (
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead className="bg-slate-800 text-white">
                <tr className="text-left select-none">
                  <Th onClick={() => handleSort('patente')}>Patente{arrow('patente')}</Th>
                  <Th onClick={() => handleSort('tipo')}>Tipo{arrow('tipo')}</Th>
                  <Th onClick={() => handleSort('capacidad')}>Capacidad{arrow('capacidad')}</Th>
                  <Th onClick={() => handleSort('estado')}>Estado{arrow('estado')}</Th>
                  <Th onClick={() => handleSort('km')}>Kilometraje{arrow('km')}</Th>
                  <Th>Último mantenimiento</Th>
                  <Th>Próximo service</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
            </table>

            <div className="h-[384px] overflow-y-auto border-x border-b rounded-b border-neutral-200 dark:border-neutral-800">
              <table className="w-full table-fixed">
                <tbody className="bg-white dark:bg-neutral-900">
                  {displayData.map((v: any) => {
                    const info = calcNextService(v);
                    const badge =
                      info.tone === 'ok'
                        ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                        : info.tone === 'warn'
                        ? 'bg-amber-100 text-amber-700 ring-amber-200'
                        : 'bg-rose-100 text-rose-700 ring-rose-200';
                    return (
                      <tr key={v._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <Td>{v.patente}</Td>
                        <Td className="capitalize">{v.tipo}</Td>
                        <Td>{v.capacidad}</Td>
                        <Td className="capitalize">{v.estado ?? '-'}</Td>
                        <Td>{formatKm(v.km ?? 0)}</Td>
                        <Td>{v.FechaUltimoMantenimiento || '-'}</Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center whitespace-nowrap leading-none w-fit rounded-full px-2 py-0.5 text-xs ring-1 ${badge}`}>
                              Próx. a los {formatKm(info.nextAtKm)} km
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {info.remaining > 0
                                ? `faltan ${formatKm(info.remaining)} km`
                                : info.remaining === 0
                                ? 'vencer hoy'
                                : `vencido por ${formatKm(Math.abs(info.remaining))} km`}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <button
                            onClick={() => handleRegistrarMantenimiento(v)}
                            disabled={busyId === v._id}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
                          >
                            {busyId === v._id ? 'Guardando...' : 'Registrar mantenimiento'}
                          </button>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== FORM alta ===== */}
        <div className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            Agregar vehículo
          </h3>

          <form onSubmit={handleAddVehiculo} className="flex flex-wrap gap-3">
            <Field label="Patente" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="text"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={patente}
                onChange={(e) => setPatente(e.target.value)}
                required
              />
            </Field>

            <Field label="Tipo" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <select
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Colectivo">Colectivo</option>
                <option value="Camion">Camión</option>
                <option value="Trafic">Trafic</option>
              </select>
            </Field>

            <Field label="Capacidad" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="number"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                required
                min={1}
              />
            </Field>

            <Field label="Kilometraje inicial" className="flex-1 basis-full sm:basis-[calc(50%-0.375rem)] min-w-[220px]">
              <input
                type="number"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                required
                min={0}
              />
            </Field>

            <div className="basis-full">
              <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700">
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
function Th({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <th onClick={onClick} className="px-3 py-2 cursor-pointer select-none">
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={["px-3 py-2 h-12 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200", className].join(" ")}>
      {children}
    </td>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={["flex flex-col", className].join(" ")}>
      <label className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
