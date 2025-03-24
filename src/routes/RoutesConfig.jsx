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
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

export const RoutesConfig = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authContext = useContext(AuthContext);

  // Validamos si `authContext` está inicializado correctamente
  if (!authContext) {
    console.error("AuthContext no está inicializado");
    return null; // Evitamos seguir si el contexto no está disponible
  }

  const { user } = authContext;

  useEffect(() => {
    user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  })

  return (
    <Routes>
      {isLoggedIn ? (
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

