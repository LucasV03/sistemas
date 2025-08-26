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
    apellido: v.string(),
    email: v.string(),
    password: v.string(),
    rol: v.optional(v.string()), // <- opcional también acá
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("usuarios", {
      ...args,
      rol: args.rol ?? "Chofer", // <- default si no lo mandás
    });
  },
});
