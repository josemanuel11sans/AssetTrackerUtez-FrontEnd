import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import GestionInventarios from "./pages/GestionInventarios"
import CategoriasEspacios from "./pages/CategoriasEspacios"
import CategoriaRecursos from "./pages/CategoriaRecursos"
import Responsables from "./pages/Responsables"
import Usuarios from "./pages/Usuarios"
import NuevasCuentas from "./pages/NuevasCuentas"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gestion-inventarios" element={<GestionInventarios />} />
            <Route path="/categorias-espacios" element={<CategoriasEspacios />} />
            <Route path="/categoria-recursos" element={<CategoriaRecursos />} />
            <Route path="/responsables" element={<Responsables />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/nuevas-cuentas" element={<NuevasCuentas />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

