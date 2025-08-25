// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    usuarios: defineTable({
        nombre: v.string(),
        
        email: v.string(),
        rol: v.string(), // admin, chofer
    }),
  vehiculos: defineTable({
    patente: v.string(),
    tipo: v.string(), // camión, bus, camioneta
    capacidad: v.number(),
    estado: v.string(), // disponible, en viaje, mantenimiento
    km: v.number(),
    ultimoMantenimientoKm: v.number(),
  }),

  viajes: defineTable({
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(), // formato YYYY-MM-DD
  }),

  reportes: defineTable({
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  mantenimientos: defineTable({
    vehiculoId: v.id("vehiculos"),
    km: v.number(),
    fecha: v.string(), // formato YYYY-MM-DD
  }),

  reportesMantenimientos: defineTable({
    mantenimientoId: v.id("mantenimientos"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesViajes: defineTable({
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesVehiculos: defineTable({
    vehiculoId: v.id("vehiculos"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesUsuarios: defineTable({
    usuarioId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesChoferes: defineTable({
    choferId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesSupervisores: defineTable({
    supervisorId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

  reportesAdmins: defineTable({
    adminId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(), // completado, pendiente, cancelado
    creadoEn: v.string(), // fecha/hora ISO
  }),

});
