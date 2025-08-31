// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ===== Usuarios y RRHH =====
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

  // ===== Flota y Operaciones =====
  vehiculos: defineTable({
    patente: v.string(),
    tipo: v.string(),                 // camión, bus, camioneta
    capacidad: v.number(),
    estado: v.string(),               // disponible, en viaje, mantenimiento
    km: v.number(),
    FechaUltimoMantenimiento: v.string(),
  }),

  viajes: defineTable({
    vehiculoId: v.id("vehiculos"),
    choferId: v.id("usuarios"),
    origen: v.string(),
    destino: v.string(),
    fecha: v.string(),                // formato YYYY-MM-DD
  }),

  repuestos: defineTable({
    codigo: v.string(),                   // Código interno o SKU
    nombre: v.string(),                   // Nombre del repuesto
    descripcion: v.optional(v.string()),  // Detalle técnico
    categoria: v.string(),                // Motor, frenos, suspensión, etc.
    vehiculo: v.string(),                 // "trafic" | "colectivo" | "ambos"
    marca: v.optional(v.string()),
    modeloCompatible: v.optional(v.string()),
    stock: v.number(),
    precioUnitario: v.number(),
    ubicacion: v.optional(v.string()),    // Estante, depósito, taller
    imagenUrl: v.optional(v.string()),
    fechaIngreso: v.string(),             // YYYY-MM-DD
  })
  .index("byCodigo", ["codigo"])
  .index("byCategoria", ["categoria"])
  .index("byVehiculo", ["vehiculo"]),

  reportes: defineTable({
    viajeId: v.id("viajes"),
    descripcion: v.string(),
    estado: v.string(),               // completado, pendiente, cancelado
    creadoEn: v.string(),             // fecha/hora ISO
  }),

  mantenimientos: defineTable({
    vehiculoId: v.id("vehiculos"),
    km: v.number(),
    fecha: v.string(),                // YYYY-MM-DD
  }),

  reportesMantenimientos: defineTable({
    mantenimientoId: v.id("mantenimientos"),
    descripcion: v.string(),
    estado: v.string(),               // completado, pendiente, cancelado
    creadoEn: v.string(),             // fecha/hora ISO
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
    unidadId: v.string(),             // ej: "BUS-101"
    lat: v.number(),
    lng: v.number(),
    estado: v.optional(v.string()),   // "A tiempo" | "Demora" | ...
    ts: v.number(),                   // Date.now()
  })
  .index("byUnidadId", ["unidadId"]),

  // ===== CRM =====
  clientes: defineTable({
    nombre: v.string(),
    correo: v.string(),
    telefono: v.optional(v.string()),
    empresa: v.optional(v.string()),
    notas: v.optional(v.string()),
    creadoPor: v.optional(v.string()), // id de usuario si se agrega autenticación
    creadoEn: v.number(),              // Date.now()
  })
  .index("por_correo", ["correo"])
  .index("por_nombre", ["nombre"]),

  // Contratos: sin campos de archivo individuales (adjuntos van en `contratos_adjuntos`)
  contratos: defineTable({
    clienteId: v.id("clientes"),
    titulo: v.string(),
    fechaInicio: v.string(),           // ISO
    fechaFin: v.optional(v.string()),
    monto: v.number(),
    estado: v.string(),                // 'activo' | 'pendiente' | 'finalizado' | 'cancelado'
    notas: v.optional(v.string()),
    creadoEn: v.number(),
  })
  .index("por_cliente", ["clienteId"])
  .index("por_estado", ["estado"]),

  // Interacciones con clientes
  interacciones: defineTable({
    clienteId: v.id("clientes"),
    contratoId: v.optional(v.id("contratos")),
    tipo: v.string(),                  // 'llamada' | 'correo' | 'reunión' | 'ticket'
    resumen: v.string(),
    proximaAccion: v.optional(v.string()), // ISO
    creadoEn: v.number(),
  })
  .index("por_cliente", ["clienteId"])
  .index("por_contrato", ["contratoId"])
  .index("por_proximaAccion", ["proximaAccion"]),

  // ===== Adjuntos de contratos (múltiples) =====
  contratos_adjuntos: defineTable({
    contratoId: v.id("contratos"),
    archivoId: v.id("_storage"),
    nombre: v.optional(v.string()),
    tipo: v.optional(v.string()),
    tamanio: v.optional(v.number()),
    subidoEn: v.number(),              // Date.now()
  })
  .index("por_contrato", ["contratoId"]),

  // ===== Historial de contratos =====
  // Guarda cambios: actualización de campos del contrato y snapshots de adjuntos (agregar/eliminar)
  contratos_historial: defineTable({
    contratoId: v.id("contratos"),
    cambiadoEn: v.number(),            // Date.now()

    // Datos anteriores del contrato (cuando se actualiza el contrato)
    estadoAnterior: v.optional(v.string()),
    montoAnterior: v.optional(v.number()),
    fechaInicioAnterior: v.optional(v.string()),
    fechaFinAnterior: v.optional(v.string()),
    notasAnteriores: v.optional(v.string()),

    // Tipo de cambio para distinguir eventos
    // 'actualizar' | 'agregar_adjunto' | 'eliminar_adjunto'
    tipoCambio: v.optional(v.string()),

    // Snapshot de adjuntos anteriores (cuando se agregan/eliminan adjuntos)
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
