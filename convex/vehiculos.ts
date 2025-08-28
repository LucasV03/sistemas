import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULTS: Record<string, number> = {
  Colectivo: 10000,
  Camion: 15000,
  Trafic: 8000,
};

// LISTAR
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehiculos").collect();
  },
});

// CREAR (con km ingresado desde el form)
export const crear = mutation({
  args: {
    patente: v.string(),
    tipo: v.string(),
    capacidad: v.number(),
    km: v.number(), // 👈 agregado
  },
  handler: async (ctx, args) => {
    const patente = args.patente.trim().toUpperCase().replace(/\s+/g, "");
    const tipo = String(args.tipo).trim();
    const capacidad = Math.max(0, Math.floor(args.capacidad));
    const km = Math.max(0, Math.floor(args.km));
    const interval = DEFAULTS[tipo] ?? 10000;

    return await ctx.db.insert("vehiculos", {
      patente,
      tipo,
      capacidad,
      km,                       // 👈 se guarda
      estado: "Disponible",
      FechaUltimoMantenimiento: "",
      ultimoServiceKm: 0,       // hasta que se registre el primer mantenimiento
      serviceIntervalKm: interval,
    });
  },
});

// REGISTRAR MANTENIMIENTO
export const registrarMantenimiento = mutation({
  args: { vehiculoId: v.id("vehiculos"), fecha: v.string(), km: v.number() },
  handler: async (ctx, { vehiculoId, fecha, km }) => {
    await ctx.db.patch(vehiculoId, {
      FechaUltimoMantenimiento: fecha,
      ultimoServiceKm: Math.max(0, Math.floor(km)),
    });
  },
});
