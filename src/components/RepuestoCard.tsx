"use client";
import React, { useState } from "react";

export default function RepuestoCard({
  repuesto,
  onUpdate,
  onDelete,
}: {
  repuesto: any;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <article className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition flex flex-col justify-between">
      

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">
          {repuesto.nombre}
        </h3>
        <p className="text-sm text-slate-600 mb-2">{repuesto.descripcion}</p>

        {/* Mostrar menos info por defecto */}
        <div className="text-xs text-slate-700 space-y-1">
          <p>
            <b>Código:</b> {repuesto.codigo}
          </p>
          <p>
            <b>Stock:</b> {repuesto.stock}
          </p>
          <p>
            <b>Precio:</b> ${repuesto.precioUnitario}
          </p>
        </div>

        {/* Botón para expandir */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-2 text-blue-600 text-sm font-medium hover:underline"
        >
          {showMore ? "Ver menos ▲" : "Ver más ▼"}
        </button>

        {/* Info extra al expandir */}
        {showMore && (
          <div className="mt-2 text-xs text-slate-700 space-y-1">
            <p>
              <b>Categoría:</b> {repuesto.categoria}
            </p>
            <p>
              <b>Vehículo:</b> {repuesto.vehiculo}
            </p>
            <p>
              <b>Marca:</b> {repuesto.marca}
            </p>
            <p>
              <b>Modelo:</b> {repuesto.modeloCompatible}
            </p>
            <p>
              <b>Ubicación:</b> {repuesto.ubicacion}
            </p>
            <p>
              <b>Ingreso:</b>{" "}
              {new Date(repuesto.fechaIngreso).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onUpdate}
          className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
