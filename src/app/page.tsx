// src/app/page.tsx
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { Bus } from "../components/BusMap";

// ⬇️ Import dinámico SIN SSR (clave para Leaflet/react-leaflet)
const BusMap = dynamic(() => import("../components/BusMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-lg bg-slate-100 animate-pulse" />
  ),
});

export default function Home() {
  // --- Mock estático (reemplazar luego) ---
  const KPIS = [
    { label: "Unidades activas", value: "42 / 58" },
    { label: "Puntualidad", value: "92%" },
    { label: "Alertas abiertas", value: "3" },
    { label: "", value: "........." },
  ];

  const PRIORIDADES = [
    "Incidencia crítica: BUS-214 – lectora SUBE intermitente",
    "Demora por tráfico en Ruta C→D – ajustar frecuencia",
    "Unidad BUS-031 entra a mantenimiento hoy 18:00",
  ];

  const VIAJES_HOY = [
    { unidad: "BUS-102", ruta: "A → B", salida: "12:30", estado: "A tiempo" },
    { unidad: "BUS-088", ruta: "C → D", salida: "12:45", estado: "Demora 5’" },
    { unidad: "BUS-031", ruta: "E → A", salida: "13:10", estado: "A tiempo" },
    { unidad: "BUS-214", ruta: "B → C", salida: "13:30", estado: "Reasignado" },
    { unidad: "BUS-131", ruta: "Terminal → Norte", salida: "13:45", estado: "A tiempo" },
    { unidad: "BUS-077", ruta: "Sur → Centro", salida: "14:00", estado: "Demora 10’" },
  ];

  const FUERA_SERVICIO = [
    { unidad: "BUS-214", motivo: "Lectora SUBE", estado: "Diagnóstico" },
    { unidad: "BUS-031", motivo: "Mantenimiento programado", estado: "18:00" },
  ];

  const INCIDENCIAS = [
    { sev: "Alta", texto: "Demora en Acceso Norte (obras)" },
    { sev: "Media", texto: "Parada 123 sin luz – reportada" },
    { sev: "Baja", texto: "Cartelería desactualizada en Ruta E" },
  ];

  const PERSONAL = [
    "2 choferes sin asignación para la franja 14–16 h",
    "Ausencia reportada: J. Pérez (turno tarde)",
    "Vencimiento licencia: M. Gómez (30 días)",
  ];

  const BUSES: Bus[] = [
    { id: "BUS-102", lat: -24.787, lng: -65.41, route: "A → B", speedKmH: 38, heading: 45, updatedAt: new Date().toISOString() },
    { id: "BUS-088", lat: -24.80,  lng: -65.44, route: "C → D", speedKmH: 22, heading: 320, updatedAt: new Date().toISOString() },
    { id: "BUS-031", lat: -24.775, lng: -65.43, route: "E → A", speedKmH: 41, heading: 190, updatedAt: new Date().toISOString() },
  ];

  return (
    <main className="space-y-9">
      {/* Encabezado */}
      <header className="shadow-xl/10 rounded-xl bg-slate-100 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Panel operativo</h1>
        <p className="text-slate-950">Estado actual de flota, viajes e incidencias</p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-xl bg-white p-4 ring-1 ring-slate-200 shadow">
            <div className="text-sm text-slate-500">{k.label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{k.value}</div>
          </div>
        ))}
      </section>

      {/* Dos columnas principales */}
      <section className="grid gap-6 xl:grid-cols-3 ">
        {/* Columna grande */}
        <div className="xl:col-span-2 space-y-3 ">
          {/* Prioridades */}
          <Card title="Prioridades de hoy">
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {PRIORIDADES.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Card>

          {/* Salidas próximas */}
          <Card title="Salidas próximas (hoy)">
            <div className="max-h-36 overflow-y-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="px-3 py-2 text-left">Unidad</th>
                    <th className="px-3 py-2 text-left">Ruta</th>
                    <th className="px-3 py-2 text-left">Salida</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {VIAJES_HOY.map((v, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2 font-medium text-slate-900">{v.unidad}</td>
                      <td className="px-3 py-2">{v.ruta}</td>
                      <td className="px-3 py-2">{v.salida}</td>
                      <td className="px-3 py-2">
                        <span className={[
                          "rounded-full px-2 py-0.5 text-xs",
                          v.estado.includes("Demora") ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200" :
                          v.estado.includes("Reasignado") ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" :
                          "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                        ].join(" ")}>{v.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Incidencias y Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card title="Incidencias" className="h-full">
              <ul className="space-y-1 text-sm">
                {INCIDENCIAS.map((i, idx) => (
                  <li key={idx} className="rounded-lg border p-2">
                    <span
                      className={[
                        "mr-2 rounded px-2 py-0.5 text-xs",
                        i.sev === "Alta"
                          ? "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                          : i.sev === "Media"
                          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                          : "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
                      ].join(" ")}
                    >
                      {i.sev}
                    </span>
                    {i.texto}
                  </li>
                ))}
                {INCIDENCIAS.length === 0 && (
                  <li className="text-slate-500">Sin incidencias.</li>
                )}
              </ul>
            </Card>

            <Card title="Personal" className="h-full">
              <ul className="list-disc pl-4 space-y-2 text-sm text-slate-700">
                {PERSONAL.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-12 w-130">
          <Card title="Mapa — flota en vivo">
            <BusMap buses={BUSES} />
          </Card>
          <Card title="Flota — fuera de servicio">
            <ul className="space-y-2 text-sm">
              {FUERA_SERVICIO.map((u) => (
                <li key={u.unidad} className="flex justify-between rounded-lg border p-2">
                  <span className="font-medium text-slate-900">{u.unidad}</span>
                  <span className="text-slate-600">{u.motivo} — {u.estado}</span>
                </li>
              ))}
              {FUERA_SERVICIO.length === 0 && <li className="text-slate-500">Sin novedades.</li>}
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-[#1e1e1e] p-4 shadow-md border border-gray-800 ${className}`}>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="text-gray-300">
        {children}
      </div>
    </section>
  );
}

