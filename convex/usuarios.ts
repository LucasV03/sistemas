// convex/usuarios.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Listar usuarios
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("usuarios").collect();
  },
});

// Crear usuario
export const crear = mutation({
  args: {
    nombre: v.string(),
    edad: v.number(),
    email: v.string(),
    rol: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("usuarios", args);
  },
});
