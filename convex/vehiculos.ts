// convex/vehiculos.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Listar vehículos
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehiculos").collect();
  },
});

// Crear vehículo
export const crear = mutation({
  args: {
    patente: v.string(),
    tipo: v.string(),
    capacidad: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vehiculos", {
      ...args,
      estado: "Disponible",
      km: 0,
      FechaUltimoMantenimiento: "",
    });
  },
});

// Cambiar estado del vehículo
export const cambiarEstado = mutation({
  args: {
    vehiculoId: v.id("vehiculos"),
    estado: v.string(),
  },
  handler: async (ctx, { vehiculoId, estado }) => {
    await ctx.db.patch(vehiculoId, { estado });
  },
});
