"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
export default function VehiculosPage() {
  const vehiculos = useQuery(api.vehiculos.listar, {});

  if (vehiculos === undefined) {
    return <p>Cargando...</p>; // mientras se trae la data
  }

  return (
    <div>
      <h1>Vehículos</h1>
      <ul>
        {vehiculos.map((v) => (
          <li key={v._id}>
            {v.patente} - {v.tipo} - {v.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
