// convex/viajes.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ---- Estado reusable ----
export const vEstado = v.union(
  v.literal("Programado"),
  v.literal("En curso"),
  v.literal("Demorado"),
  v.literal("Cancelado"),
  v.literal("Completado")
);
export type Estado =
  | "Programado"
  | "En curso"
  | "Demorado"
  | "Cancelado"
  | "Completado";

// ✅ Aceptar choferes desde "usuarios" o "empleados"
const vChoferId = v.union(v.id("usuarios"), v.id("empleados"));

/**
 * Crear viaje
 */
export const crear = mutation({
  args: {
    vehiculoId: v.id("vehiculos"),
    choferId: vChoferId,                // <- unión usuarios/empleados
    origen: v.string(),
    destino: v.string(),
    ruta: v.string(),                   // ej: "A → B"
    salidaProgramada: v.number(),       // epoch ms
    estado: vEstado,
    retrasoMin: v.optional(v.number()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validaciones explícitas con mensajes claros
    if (!Number.isFinite(args.salidaProgramada)) {
      throw new Error("salidaProgramada debe ser un número (epoch ms).");
    }
    if (!args.origen.trim() || !args.destino.trim() || !args.ruta.trim()) {
      throw new Error("origen, destino y ruta no pueden estar vacíos.");
    }

    // Verificar existencia de refs
    const [veh, chofer] = await Promise.all([
      ctx.db.get(args.vehiculoId),
      // get funciona con Id<"usuarios"> o Id<"empleados">
      ctx.db.get(args.choferId as any),
    ]);
    if (!veh) throw new Error("vehiculoId inexistente.");
    if (!chofer) throw new Error("choferId inexistente (usuarios/empleados).");

    // Insertar
    return await ctx.db.insert("viajes", args);
  },
});

/**
 * Actualizar viaje (parcial)
 */
export const actualizar = mutation({
  args: {
    id: v.id("viajes"),
    vehiculoId: v.optional(v.id("vehiculos")),
    choferId: v.optional(vChoferId),    // <- unión consistente
    origen: v.optional(v.string()),
    destino: v.optional(v.string()),
    ruta: v.optional(v.string()),
    salidaProgramada: v.optional(v.number()),
    estado: v.optional(vEstado),
    retrasoMin: v.optional(v.number()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    if (
      patch.salidaProgramada !== undefined &&
      !Number.isFinite(patch.salidaProgramada)
    ) {
      throw new Error("salidaProgramada debe ser un número (epoch ms).");
    }
    await ctx.db.patch(id, patch);
  },
});

/**
 * Listar viajes (opcionalmente por estado)
 */
export const listar = query({
  args: { estado: v.optional(vEstado) },
  handler: async (ctx, { estado }) => {
    let docs;
    if (estado) {
      docs = await ctx.db
        .query("viajes")
        .withIndex("by_estado", (q) => q.eq("estado", estado))
        .collect();
    } else {
      docs = await ctx.db
        .query("viajes")
        .withIndex("by_salidaProgramada", (q) => q.gte("salidaProgramada", 0))
        .order("asc")
        .collect();
    }

    // Enriquecer con patente
    const result = await Promise.all(
      docs.map(async (vje) => {
        const veh = await ctx.db.get(vje.vehiculoId);
        return { ...vje, unidad: veh?.patente ?? "—" };
      })
    );
    return result;
  },
});

/**
 * Próximas salidas de HOY
 */
export const proximosHoy = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end   = new Date(now); end.setHours(23, 59, 59, 999);

    const docs = await ctx.db
      .query("viajes")
      .withIndex("by_salidaProgramada", (q) =>
        q.gte("salidaProgramada", start.getTime()).lt("salidaProgramada", end.getTime())
      )
      .filter((q) => q.neq(q.field("estado"), "Cancelado"))
      .order("asc")
      .collect();

    const result = await Promise.all(
      docs.map(async (vje) => {
        const veh = await ctx.db.get(vje.vehiculoId);
        return {
          _id: vje._id,
          unidad: veh?.patente ?? "—",
          ruta: vje.ruta,
          salidaProgramada: vje.salidaProgramada,
          estado: vje.estado as Estado,
          retrasoMin: vje.retrasoMin ?? 0,
        };
      })
    );
    return result;
  },
});
