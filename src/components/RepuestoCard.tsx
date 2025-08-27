"use client";

type Props = {
  repuesto: any;
  onUpdate: () => void;
  onDelete: () => void;
};

export default function RepuestoCard({ repuesto, onUpdate, onDelete }: Props) {
  return (
    <div className="border rounded-xl shadow p-4 bg-white flex flex-col gap-2">
      <h2 className="text-lg font-bold">{repuesto.nombre}</h2>
      <p className="text-sm text-gray-600">Precio: ${repuesto.precioUnitario}</p>
      {repuesto.imagen && (
        <img
          src={repuesto.imagen}
          alt={repuesto.nombre}
          className="w-full h-40 object-cover rounded"
        />
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onUpdate}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
