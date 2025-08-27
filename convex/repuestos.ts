import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Listar repuestos
export const listar = query({
  args: {},  // <- aunque esté vacío, el cliente debe mandar un objeto
  handler: async (ctx) => {
    return await ctx.db.query("repuestos").collect();
  },
});


// Crear repuesto
export const crear = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("repuestos", args);
  },
});

// Eliminar repuesto
export const eliminar = mutation({
  args: { id: v.id("repuestos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const base = [
      { 
        codigo: "REP-001",
        nombre: "Filtro de aceite",
        descripcion: "Filtro de aceite estándar para motor diésel",
        categoria: "Motor",
        vehiculo: "Traffic",
        marca: "Mann",
        modeloCompatible: "Master 2.3",
        stock: 15,
        precioUnitario: 2500,
        ubicacion: "Estante A1",
        imagenUrl: "https://example.com/filtro-aceite.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-002",
        nombre: "Filtro de aire",
        descripcion: "Filtro de aire para vehículos de media distancia",
        categoria: "Motor",
        vehiculo: "Colectivo",
        marca: "Bosch",
        modeloCompatible: "Scania K310",
        stock: 20,
        precioUnitario: 3200,
        ubicacion: "Estante A2",
        imagenUrl: "https://example.com/filtro-aire.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-003",
        nombre: "Pastillas de freno",
        descripcion: "Juego de pastillas de freno delanteras",
        categoria: "Frenos",
        vehiculo: "Traffic",
        marca: "Ferodo",
        modeloCompatible: "Iveco Daily",
        stock: 10,
        precioUnitario: 7800,
        ubicacion: "Estante B1",
        imagenUrl: "https://example.com/pastillas-freno.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-004",
        nombre: "Bujía de encendido",
        descripcion: "Bujías para motor a nafta",
        categoria: "Motor",
        vehiculo: "Traffic",
        marca: "NGK",
        modeloCompatible: "Kangoo 1.6",
        stock: 30,
        precioUnitario: 950,
        ubicacion: "Estante C1",
        imagenUrl: "https://example.com/bujia.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-005",
        nombre: "Correa de distribución",
        descripcion: "Correa de distribución reforzada",
        categoria: "Motor",
        vehiculo: "Colectivo",
        marca: "Gates",
        modeloCompatible: "Mercedes-Benz OF1722",
        stock: 5,
        precioUnitario: 12500,
        ubicacion: "Estante B3",
        imagenUrl: "https://example.com/correa.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-006",
        nombre: "Amortiguador delantero",
        descripcion: "Amortiguador delantero hidráulico",
        categoria: "Suspensión",
        vehiculo: "Colectivo",
        marca: "Monroe",
        modeloCompatible: "Marcopolo G7",
        stock: 8,
        precioUnitario: 18500,
        ubicacion: "Estante D1",
        imagenUrl: "https://example.com/amortiguador.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-007",
        nombre: "Amortiguador trasero",
        descripcion: "Amortiguador trasero para media distancia",
        categoria: "Suspensión",
        vehiculo: "Traffic",
        marca: "Sachs",
        modeloCompatible: "Sprinter 415",
        stock: 7,
        precioUnitario: 17800,
        ubicacion: "Estante D2",
        imagenUrl: "https://example.com/amortiguador-trasero.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-008",
        nombre: "Batería 12V",
        descripcion: "Batería 12V 150Ah",
        categoria: "Eléctrico",
        vehiculo: "Colectivo",
        marca: "Willard",
        modeloCompatible: "Scania K400",
        stock: 12,
        precioUnitario: 45000,
        ubicacion: "Estante E1",
        imagenUrl: "https://example.com/bateria.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-009",
        nombre: "Disco de freno",
        descripcion: "Disco de freno ventilado delantero",
        categoria: "Frenos",
        vehiculo: "Traffic",
        marca: "Brembo",
        modeloCompatible: "Master 2.3",
        stock: 6,
        precioUnitario: 21000,
        ubicacion: "Estante B2",
        imagenUrl: "https://example.com/disco-freno.jpg",
        fechaIngreso: new Date().toISOString(),
      },
      { 
        codigo: "REP-010",
        nombre: "Inyector de combustible",
        descripcion: "Inyector de alta presión",
        categoria: "Motor",
        vehiculo: "Colectivo",
        marca: "Delphi",
        modeloCompatible: "Mercedes-Benz O500",
        stock: 9,
        precioUnitario: 13500,
        ubicacion: "Estante A3",
        imagenUrl: "https://example.com/inyector.jpg",
        fechaIngreso: new Date().toISOString(),
      },
    ];

    // Evitar duplicados por código
    const existentes = await ctx.db.query("repuestos").collect();
    const ya = new Set(existentes.map((r) => r.codigo));

    let insertados = 0;
    for (const r of base) {
      if (!ya.has(r.codigo)) {
        await ctx.db.insert("repuestos", r);
        insertados++;
      }
    }
    return { insertados };
  },
});
