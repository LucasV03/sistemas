"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
    const usuarios = useQuery(api.usuarios.listar, {});
    const addUsuario = useMutation(api.usuarios.crear);

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (usuarios === undefined) {
        return (
            <main className="p-6 max-w-4xl mx-auto">
                <p className="text-gray-500">Cargando usuarios...</p>
            </main>
        );
    }}