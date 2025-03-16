"use client"

import Home from "../pages/Home"
import GestionInventarios from "../pages/GestionInventarios"
import CategoriasEspacios from "../pages/CategoriasEspacios"
import CategoriaRecursos from "../pages/CategoriaRecursos"
import Responsables from "../pages/Responsables"
import Usuarios from "../pages/Usuarios"
import NuevasCuentas from "../pages/NuevasCuentas"
import Login from "../pages/Login"
import NotFoundPage from "../pages/Notfoundpage"
import Layout from "../components/Layout"
import { Routes, Route } from "react-router-dom"
import { useState } from "react"

export const RoutesConfig = () => {
  const [log, setLog] = useState(true)
  return (
    <Routes>
      {log ? (
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gestion-inventarios" element={<GestionInventarios />} />
          <Route path="/categorias-espacios" element={<CategoriasEspacios />} />
          <Route path="/categoria-recursos" element={<CategoriaRecursos />} />
          <Route path="/responsables" element={<Responsables />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/nuevas-cuentas" element={<NuevasCuentas />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

