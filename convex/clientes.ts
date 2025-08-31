// ARCHIVO: convex/clientes.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const crear = mutation({
  args: {
    nombre: v.string(),
    correo: v.string(),
    telefono: v.optional(v.string()),
    empresa: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const correoNormalizado = args.correo.trim().toLowerCase();

    // Regex literal (NO como string). Si tu editor cambia barras, reescribilo manualmente.
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado);
    if (!correoValido) {
      throw new Error("El correo no es válido");
    }

    const existente = await ctx.db
      .query("clientes")
      .withIndex("por_correo", (q) => q.eq("correo", correoNormalizado))
      .unique();

    if (existente) {
      throw new Error("Ya existe un cliente con ese correo");
    }

    return await ctx.db.insert("clientes", {
      nombre: args.nombre.trim(),
      correo: correoNormalizado,
      telefono: args.telefono?.trim(),
      empresa: args.empresa?.trim(),
      notas: args.notas?.trim(),
      creadoEn: Date.now(),
    });
  },
});

export const listar = query({
  args: { busqueda: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // order("desc") es válido (ordena por _creationTime). Si tu versión de Convex diera error,
    // reemplazalo por: const todos = await ctx.db.query("clientes").collect();
    const todos = await ctx.db.query("clientes").order("desc").collect();
    if (!args.busqueda) return todos;

    const b = args.busqueda.toLowerCase();
    return todos.filter((c) =>
      [c.nombre, c.correo, c.telefono ?? "", c.empresa ?? ""].some((t) =>
        (t ?? "").toLowerCase().includes(b)
      )
    );
  },
});

export const obtener = query({
  args: { id: v.id("clientes") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const actualizar = mutation({
  args: {
    id: v.id("clientes"),
    nombre: v.string(),
    correo: v.string(),
    telefono: v.optional(v.string()),
    empresa: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...data }) => {
    const cliente = await ctx.db.get(id);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }
    return await ctx.db.patch(id, { ...data });
  },
});

export const eliminar = mutation({
  args: { id: v.id("clientes") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
