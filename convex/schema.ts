// convex/schema.ts
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
    tipo: v.string(), // camión, bus, camioneta
    capacidad: v.number(),
    estado: v.string(), // disponible, en viaje, mantenimiento
    km: v.number(),
    FechaUltimoMantenimiento: v.string(), 
  }),

  viajes: defineTable({
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(), // formato YYYY-MM-DD
  }),

  repuestos: defineTable({
    codigo: v.string(),              // Código interno o SKU
    nombre: v.string(),              // Nombre del repuesto (ej: Filtro de aceite)
    descripcion: v.optional(v.string()), // Detalle técnico
    categoria: v.string(),           // Motor, frenos, suspensión, eléctrico, carrocería, etc.
    vehiculo: v.string(),            // "trafic" | "colectivo" | "ambos"
    marca: v.optional(v.string()),   // Marca del repuesto
    modeloCompatible: v.optional(v.string()), // Modelos compatibles
    stock: v.number(),               // Cantidad disponible
    precioUnitario: v.number(),      // Precio estimado
    ubicacion: v.optional(v.string()), // Estante, depósito, taller
    imagenUrl: v.optional(v.string()),
    fechaIngreso: v.string(),        // Formato YYYY-MM-DD
  })
  .index("byCodigo", ["codigo"])
  .index("byCategoria", ["categoria"])
  .index("byVehiculo", ["vehiculo"]),


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
   pos_ultimas: defineTable({
    unidadId: v.string(),     // ej: "BUS-101"
    lat: v.number(),
    lng: v.number(),
    estado: v.optional(v.string()),  // "A tiempo" | "Demora" | ...
    ts: v.number(),                  // Date.now()
  })
  .index("byUnidadId", ["unidadId"]),
});

