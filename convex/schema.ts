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
    km: v.optional(v.number()), 
    estado: v.optional(v.string()),
    FechaUltimoMantenimiento: v.optional(v.string()),
    ProximoMantenimiento: v.optional(v.string()),
    ultimoServiceKm: v.optional(v.number()),
    serviceIntervalKm: v.optional(v.number()), 
  }).index("by_patente", ["patente"]),

  mantenimientos: defineTable({
    vehiculoId: v.id("vehiculos"),
    km: v.number(),
    fecha: v.optional(v.string()), 
    FechaUltimoMantenimiento: v.optional(v.string()),
  }).index("byVehiculoFecha", ["vehiculoId", "fecha"]),

  

  

viajes: defineTable({
  vehiculoId: v.id("vehiculos"),
  choferId:v.optional(v.id("empleados")), 
  origen: v.string(),
  destino: v.string(),
  ruta: v.string(),
  salidaProgramada: v.number(),
  estado: v.union(
    v.literal("Programado"),
    v.literal("En curso"),
    v.literal("Demorado"),
    v.literal("Cancelado"),
    v.literal("Completado")
  ),
  retrasoMin: v.optional(v.number()),
  notas: v.optional(v.string()),
  fecha: v.optional(v.string()),
})
  .index("by_salidaProgramada", ["salidaProgramada"])
  .index("by_estado", ["estado"])
  .index("by_vehiculo", ["vehiculoId"])
  .index("by_chofer", ["choferId"]),


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

  proveedores: defineTable({
    nombre: v.string(),
    contacto_principal: v.string(),
    telefono: v.string(),
    email: v.string(),
    direccion: v.string(),
    activo: v.boolean(), 
    reputacion: v.optional(v.number()), 
    productos_ofrecidos: v.array(v.id("repuestos")), 
    notas: v.optional(v.string()),
  }),
});
