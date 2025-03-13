// src/RoutesConfig.js
import Home from "../pages/Home";
import GestionInventarios from "../pages/GestionInventarios";
import CategoriasEspacios from "../pages/CategoriasEspacios";
import CategoriaRecursos from "../pages/CategoriaRecursos";
import Responsables from "../pages/Responsables";
import Usuarios from "../pages/Usuarios";
import NuevasCuentas from "../pages/NuevasCuentas";
import Login from "../pages/Login";
import NotFoundPage from "../pages/not-found-page";

const RoutesConfig = [
  { path: "/home", element: <Home/> },
  { path: "/gestion-inventarios", element: <GestionInventarios/> },
  { path: "/categorias-espacios", element: <CategoriasEspacios/> },
  { path: "/categoria-recursos", element: <CategoriaRecursos/> },
  { path: "/responsables", element: <Responsables/> },
  { path: "/usuarios", element: <Usuarios/> },
  { path: "/nuevas-cuentas", element: <NuevasCuentas/> },
  { path: "/login", element: <Login/> },
  { path: "*", element: <NotFoundPage/> },
];

export default RoutesConfig;
