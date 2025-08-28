import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULTS: Record<string, number> = { Colectivo: 10000, Camion: 15000, Trafic: 8000 };

// LISTAR
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehiculos").collect();
  },
});

// CREAR sin km (se setea en 0 siempre)
export const crear = mutation({
  args: {
    patente: v.string(),
    tipo: v.string(),
    capacidad: v.number(),
  },
  handler: async (ctx, args) => {
    const patente = args.patente.trim().toUpperCase().replace(/\s+/g, '');
    const tipo = String(args.tipo).trim();
    const capacidad = Math.max(0, Math.floor(args.capacidad));

    const interval = DEFAULTS[tipo] ?? 10000;

    return await ctx.db.insert("vehiculos", {
      patente,
      tipo,
      capacidad,
      km: 0, // siempre empieza en 0
      estado: "Disponible",
      FechaUltimoMantenimiento: "",
      ultimoServiceKm: 0,
      serviceIntervalKm: interval,
      // ProximoMantenimiento no se incluye si no hay valor
    });
  },
});

// REGISTRAR MANTENIMIENTO
export const registrarMantenimiento = mutation({
  args: { vehiculoId: v.id("vehiculos"), fecha: v.string(), km: v.number() },
  handler: async (ctx, { vehiculoId, fecha, km }) => {
    await ctx.db.patch(vehiculoId, {
      FechaUltimoMantenimiento: fecha,     // YYYY-MM-DD
      ultimoServiceKm: Math.max(0, Math.floor(km)),
    });
  },
});

// ACTUALIZAR KM (para más adelante si querés subir odómetro)
export const actualizarKm = mutation({
  args: { vehiculoId: v.id("vehiculos"), km: v.number() },
  handler: async (ctx, { vehiculoId, km }) => {
    await ctx.db.patch(vehiculoId, { km: Math.max(0, Math.floor(km)) });
  },
});
