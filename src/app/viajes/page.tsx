"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type RutaPreset = {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
};

const RUTAS_PREDEFINIDAS: RutaPreset[] = [
  { id: "r1", nombre: "A → B", origen: "A", destino: "B" },
  { id: "r2", nombre: "B → C", origen: "B", destino: "C" },
  { id: "r3", nombre: "C → D", origen: "C", destino: "D" },
  { id: "r4", nombre: "Terminal → Norte", origen: "Terminal", destino: "Norte" },
  { id: "r5", nombre: "Sur → Centro", origen: "Sur", destino: "Centro" },
];

export default function ViajesPage() {
  const vehiculos = useQuery(api.vehiculos.listar) as { _id: Id<"vehiculos">; patente: string }[] | undefined;
  const empleados = useQuery(api.empleados.listar) as { _id: Id<"empleados">; nombre: string; apellido: string }[] | undefined;
  const viajes = useQuery(api.viajes.listar, { estado: undefined }) ?? [];

  const crearViaje = useMutation(api.viajes.crear);

  const [vehiculoId, setVehiculoId] = useState<Id<"vehiculos"> | "">("");
  const [choferId, setChoferId] = useState<Id<"empleados"> | "">("");

  const [rutaPresetId, setRutaPresetId] = useState<string>("");
  const rutaPreset = useMemo(
    () => RUTAS_PREDEFINIDAS.find((r) => r.id === rutaPresetId),
    [rutaPresetId]
  );

  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [ruta, setRuta] = useState("");
  const [salida, setSalida] = useState("");
  const [estado, setEstado] = useState<"Programado" | "En curso" | "Demorado" | "Cancelado" | "Completado">("Programado");
  const [retrasoMin, setRetrasoMin] = useState<number | "">("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeRutaPreset = (value: string) => {
    setRutaPresetId(value);
    if (value === "" || value === "custom") {
      setOrigen("");
      setDestino("");
      setRuta("");
      return;
    }
    const preset = RUTAS_PREDEFINIDAS.find((r) => r.id === value);
    if (preset) {
      setOrigen(preset.origen);
      setDestino(preset.destino);
      setRuta(`${preset.origen} → ${preset.destino}`);
    }
  };

  const formatFecha = (ms: number) =>
    new Date(ms).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const rutaFinal = rutaPreset ? `${rutaPreset.origen} → ${rutaPreset.destino}` : ruta;
    if (!vehiculoId || !choferId) return setErrorMsg("Seleccioná vehículo y chofer.");
    if (!origen || !destino || !rutaFinal || !salida) return setErrorMsg("Completá todos los campos obligatorios.");

    const salidaMs = new Date(salida).getTime();
    if (Number.isNaN(salidaMs)) return setErrorMsg("La fecha/hora de salida no es válida.");

    setIsSubmitting(true);
    try {
      await crearViaje({
        vehiculoId,
        choferId,
        origen,
        destino,
        ruta: rutaFinal,
        salidaProgramada: salidaMs,
        estado,
        retrasoMin: retrasoMin === "" ? undefined : Number(retrasoMin),
      });

      setVehiculoId("");
      setChoferId("");
      setRutaPresetId("");
      setOrigen("");
      setDestino("");
      setRuta("");
      setSalida("");
      setEstado("Programado");
      setRetrasoMin("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || err?.message || "Error al crear el viaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      <section className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-6 shadow">
        <h2 className="text-3xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Viajes</h2>

        {/* LISTADO */}
        {viajes.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">No hay viajes registrados.</p>
        ) : (
          <div className="hidden md:block overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Unidad</th>
                  <th className="px-3 py-2 text-left">Ruta</th>
                  <th className="px-3 py-2 text-left">Salida</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Retraso</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                {viajes.map((v: any) => (
                  <tr key={v._id} className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
                    <td className="px-3 py-2">{v.unidad}</td>
                    <td className="px-3 py-2">{v.ruta}</td>
                    <td className="px-3 py-2">{formatFecha(v.salidaProgramada)}</td>
                    <td className="px-3 py-2">{v.estado}</td>
                    <td className="px-3 py-2">{v.retrasoMin ? `${v.retrasoMin} min` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM */}
        <div className="mt-8 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Agregar viaje</h3>

          {errorMsg && (
            <div className="mb-3 rounded border border-rose-300 dark:border-rose-700 bg-rose-100 dark:bg-rose-900 px-3 py-2 text-sm text-rose-800 dark:text-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Vehículo">
              <select
                value={vehiculoId || ""}
                onChange={(e) => setVehiculoId(e.target.value as unknown as Id<"vehiculos">)}
                required
                disabled={!vehiculos}
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
              >
                <option value="" disabled>Seleccioná vehículo</option>
                {(vehiculos ?? []).map((v) => (
                  <option key={v._id} value={v._id as unknown as string}>{v.patente}</option>
                ))}
              </select>
            </Field>

            <Field label="Chofer">
              <select
                value={choferId || ""}
                onChange={(e) => setChoferId(e.target.value as unknown as Id<"empleados">)}
                required
                disabled={!empleados}
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
              >
                <option value="" disabled>Seleccioná chofer</option>
                {(empleados ?? []).map((c) => (
                  <option key={c._id} value={c._id as unknown as string}>{c.nombre} {c.apellido}</option>
                ))}
              </select>
            </Field>

            <Field label="Ruta (opciones)">
              <select
                value={rutaPresetId}
                onChange={(e) => onChangeRutaPreset(e.target.value)}
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
              >
                <option value="">Seleccioná una ruta</option>
                {RUTAS_PREDEFINIDAS.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
                <option value="custom">Personalizada…</option>
              </select>
            </Field>

            <Field label="Origen">
              <input
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                required
                disabled={!!rutaPreset && rutaPresetId !== "custom"}
              />
            </Field>

            <Field label="Destino">
              <input
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                required
                disabled={!!rutaPreset && rutaPresetId !== "custom"}
              />
            </Field>

            <Field label="Ruta (texto)">
              <input
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={rutaPreset ? `${rutaPreset.origen} → ${rutaPreset.destino}` : ruta}
                onChange={(e) => setRuta(e.target.value)}
                placeholder="Ej: A → B"
                required
                disabled={!!rutaPreset && rutaPresetId !== "custom"}
              />
            </Field>

            <Field label="Salida programada">
              <input
                type="datetime-local"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={salida}
                onChange={(e) => setSalida(e.target.value)}
                required
              />
            </Field>

            <Field label="Estado">
              <select
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
              >
                <option value="Programado">Programado</option>
                <option value="En curso">En curso</option>
                <option value="Demorado">Demorado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Completado">Completado</option>
              </select>
            </Field>

            <Field label="Retraso (min)">
              <input
                type="number"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded px-3 py-2 w-full"
                value={retrasoMin}
                onChange={(e) => setRetrasoMin(e.target.value === "" ? "" : Number(e.target.value))}
                min={0}
              />
            </Field>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 disabled:opacity-60"
              >
                {isSubmitting ? "Guardando..." : "Agregar"}
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
      <label className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
      {children}
    </div>
  );
}
