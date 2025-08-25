// convex/viajes.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Listar viajes
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("viajes").collect();
  },
});

// Crear viaje
export const crear = mutation({
  args: {
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("viajes", args);
  },
});

// Actualizar viaje
export const actualizar = mutation({
  args: {
    viajeId: v.id("viajes"),
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.viajeId, args);
  },
});