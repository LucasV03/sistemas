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
    // ===== CRM =====
  clientes: defineTable({
    nombre: v.string(),
    correo: v.string(),
    telefono: v.optional(v.string()),
    empresa: v.optional(v.string()),
    notas: v.optional(v.string()),
    creadoPor: v.optional(v.string()),
    creadoEn: v.number(),
  })
  .index("por_correo", ["correo"])
  .index("por_nombre", ["nombre"]),

  // Contratos (compat: campos de archivo opcionales para datos viejos)
  contratos: defineTable({
    clienteId: v.id("clientes"),
    titulo: v.string(),
    fechaInicio: v.string(),
    fechaFin: v.optional(v.string()),
    monto: v.number(),
    estado: v.string(),
    notas: v.optional(v.string()),
    creadoEn: v.number(),
    archivoId: v.optional(v.id("_storage")),
    archivoNombre: v.optional(v.string()),
    archivoTipo: v.optional(v.string()),
    archivoTamanio: v.optional(v.number()),
  })
  .index("por_cliente", ["clienteId"])
  .index("por_estado", ["estado"]),

  interacciones: defineTable({
    clienteId: v.id("clientes"),
    contratoId: v.optional(v.id("contratos")),
    tipo: v.string(),
    resumen: v.string(),
    proximaAccion: v.optional(v.string()),
    creadoEn: v.number(),
  })
  .index("por_cliente", ["clienteId"])
  .index("por_contrato", ["contratoId"])
  .index("por_proximaAccion", ["proximaAccion"]),

  // Adjuntos múltiples por contrato
  contratos_adjuntos: defineTable({
    contratoId: v.id("contratos"),
    archivoId: v.id("_storage"),
    nombre: v.optional(v.string()),
    tipo: v.optional(v.string()),
    tamanio: v.optional(v.number()),
    subidoEn: v.number(),
  })
  .index("por_contrato", ["contratoId"]),

  // Historial de contratos (cambios + snapshot de adjuntos)
  contratos_historial: defineTable({
    contratoId: v.id("contratos"),
    cambiadoEn: v.number(),
    estadoAnterior: v.optional(v.string()),
    montoAnterior: v.optional(v.number()),
    fechaInicioAnterior: v.optional(v.string()),
    fechaFinAnterior: v.optional(v.string()),
    notasAnteriores: v.optional(v.string()),
    // 'actualizar' | 'agregar_adjunto' | 'agregar_adjuntos' | 'eliminar_adjunto'
    tipoCambio: v.optional(v.string()),
    adjuntosAnteriores: v.optional(
      v.array(
        v.object({
          archivoId: v.id("_storage"),
          nombre: v.optional(v.string()),
          tipo: v.optional(v.string()),
          tamanio: v.optional(v.number()),
        })
      )
    ),
  })
  .index("por_contrato", ["contratoId"]),

});


