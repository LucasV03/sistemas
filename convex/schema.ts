import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  usuarios: defineTable({
    nombre: v.string(),
    apellido: v.optional(v.string()),
    email: v.string(),
    password: v.optional(v.string()),
    rol: v.string()
  }),

  empleados: defineTable({
    nombre: v.string(),
    apellido: v.string(),
    email: v.string(),
    dni: v.string(),
    rol: v.string(),
  }),

  vehiculos: defineTable({
    patente: v.string(),
    tipo: v.string(),
    capacidad: v.number(),
    km: v.number(),
    estado: v.string(),
    FechaUltimoMantenimiento: v.string(),
    ProximoMantenimiento: v.optional(v.string()),
    ultimoServiceKm: v.number(),
    serviceIntervalKm: v.number(),
  }).index("by_patente", ["patente"]),

  mantenimientos: defineTable({
    vehiculoId: v.id("vehiculos"),
    km: v.number(),
    fecha: v.string(), // YYYY-MM-DD
  }).index("byVehiculoFecha", ["vehiculoId", "fecha"]),

  viajes: defineTable({
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(),
  }),

  repuestos: defineTable({
    codigo: v.string(),
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    categoria: v.string(),
    vehiculo: v.string(),
    marca: v.optional(v.string()),
    modeloCompatible: v.optional(v.string()),
    stock: v.number(),
    precioUnitario: v.number(),
    ubicacion: v.optional(v.string()),
    imagenUrl: v.optional(v.string()),
    fechaIngreso: v.string(),
  })
    .index("byCodigo", ["codigo"])
    .index("byCategoria", ["categoria"])
    .index("byVehiculo", ["vehiculo"]),

  reportes: defineTable({
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesMantenimientos: defineTable({
    mantenimientoId: v.id("mantenimientos"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesViajes: defineTable({
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesVehiculos: defineTable({
    vehiculoId: v.id("vehiculos"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesUsuarios: defineTable({
    usuarioId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesChoferes: defineTable({
    choferId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesSupervisores: defineTable({
    supervisorId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  reportesAdmins: defineTable({
    adminId: v.id("usuarios"),
    descripcion: v.string(),
    estado: v.string(),
    creadoEn: v.string(),
  }),

  pos_ultimas: defineTable({
    unidadId: v.string(),
    lat: v.number(),
    lng: v.number(),
    estado: v.optional(v.string()),
    ts: v.number(),
  }).index("byUnidadId", ["unidadId"]),
});
