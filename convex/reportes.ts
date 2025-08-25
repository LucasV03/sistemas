// convex/reportes.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Listar reportes
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reportes").collect();
  },
});

// Crear reporte
export const crear = mutation({
  args: {
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reportes", args);
  },
});
