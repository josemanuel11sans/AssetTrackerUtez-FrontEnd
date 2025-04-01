
// RoutesConfig.js
import React, { useContext} from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import GestionInventarios from "../pages/GestionInventarios";
import CategoriasEspacios from "../pages/CategoriasEspacios";
import CategoriaRecursos from "../pages/CategoriaRecursos";
import Responsables from "../pages/Responsables";
import Usuarios from "../pages/Usuarios";
import NuevasCuentas from "../pages/NuevasCuentas";
import Login from "../pages/Login";
import NotFoundPage from "../pages/Notfoundpage";
import Layout from "../components/Layout";
import Registro from "../pages/Registro";
import Espacios from "../pages/Espacios";
import Inventarios from "../pages/Inventarios";
import RecuperarContrasena from "../pages/RecuperarContrasena";
import CodigoRecuperacion from "../pages/CodigoRecuperacion";
import CambioContrasena from "../pages/CambioContrasena";

export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);
  console.log(user)
  
  return (
    <Routes>
      {user ? (
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gestion-inventarios" element={<GestionInventarios />} />
          <Route path="/categorias-espacios" element={<CategoriasEspacios />} />
          <Route path="/categoria-recursos" element={<CategoriaRecursos />} />
          <Route path="/responsables" element={<Responsables />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/nuevas-cuentas" element={<NuevasCuentas />} />
          <Route path="/gestion-inventarios/espacios/:id" element={<Espacios/>}/>
          <Route path="/gestion-inventarios/espacios/:id/inventarios/:id" element={<Inventarios/>}/>
        </Route>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/codigo-verificacion" element={<CodigoRecuperacion />} />
          <Route path="/cambio-contrasena" element={<CambioContrasena />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
