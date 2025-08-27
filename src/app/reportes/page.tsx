"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
    const reportes = useQuery(api.reportes.listar, {});
    const addReporte = useMutation(api.reportes.crear);

    // Estados del formulario
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    return <h1>Reportes</h1>;
}   