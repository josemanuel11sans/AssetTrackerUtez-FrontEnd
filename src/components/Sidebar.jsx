"use client"

// Importa los hooks y componentes necesarios de React Router y Lucide React
import { useState } from "react" // Añadir useState para manejar el estado de colapso
import { useLocation, Link } from "react-router-dom"
import { Home, ClipboardList, Layers, Database, Users, User, FileText, LogOut, ChevronLeft } from "lucide-react"
import SidebarItem from "./SidebarItem" // Importa el componente SidebarItem
import "../styles/Sidebar.css" // Importa los estilos CSS para la barra lateral
import LogoComponent from "./LogoComponent" // Importa el componente de logo

// Define el componente Sidebar
const Sidebar = () => {
  const location = useLocation() // Obtiene la ubicación actual de la ruta
  const currentPath = location.pathname // Obtiene el path actual
  const [collapsed, setCollapsed] = useState(false) // Estado para controlar si el sidebar está colapsado

  // Función para alternar el estado de colapso
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {" "}
      {/* Añadir clase condicional */}
      <div className="sidebar-header">
        {" "}
        {/* Encabezado de la barra lateral */}
        {!collapsed ? (
          <>
            <div className="header-top">
              <div className="logo-container">
                <LogoComponent size="default" />
                <span className="logo-text">ASSET TRACKER</span>
              </div>
              <button className="collapse-button" onClick={toggleSidebar}>
                <ChevronLeft size={20} />
              </button>
            </div>
          </>
        ) : (
          <button className="expand-button" onClick={toggleSidebar}>
            <LogoComponent size="small" />
          </button>
        )}
      </div>
      <div className="sidebar-section">
        {" "}
        {/* Sección de inventarios */}
        <h2 className="section-title">Inventarios</h2> {/* Título de la sección */}
        <nav className="nav-menu">
          {" "}
          {/* Menú de navegación */}
          {/* Elemento de la barra lateral para la página de inicio */}
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            to="/home"
            isActive={currentPath === "/home"}
            collapsed={collapsed}
          />
          {/* Elemento de la barra lateral para la gestión de inventarios */}
          <SidebarItem
            icon={<ClipboardList size={20} />}
            text="Gestión de inventarios"
            to="/gestion-inventarios"
            isActive={currentPath === "/gestion-inventarios"}
            collapsed={collapsed}
          />
          {/* Elemento de la barra lateral para las categorías de espacios */}
          <SidebarItem
            icon={<Layers size={20} />}
            text="Categorías de espacios"
            to="/categorias-espacios"
            isActive={currentPath === "/categorias-espacios"}
            collapsed={collapsed}
          />
          {/* Elemento de la barra lateral para la categoría de recursos */}
          <SidebarItem
            icon={<Database size={20} />}
            text="Categoría de recursos"
            to="/categoria-recursos"
            isActive={currentPath === "/categoria-recursos"}
            collapsed={collapsed}
          />
          {/* Elemento de la barra lateral para los responsables */}
          <SidebarItem
            icon={<Users size={20} />}
            text="Responsables"
            to="/responsables"
            isActive={currentPath === "/responsables"}
            collapsed={collapsed}
          />
        </nav>
      </div>
      <div className="sidebar-section">
        {" "}
        {/* Sección del sistema */}
        <h2 className="section-title">Sistema</h2> {/* Título de la sección */}
        <nav className="nav-menu">
          {" "}
          {/* Menú de navegación */}
          {/* Elemento de la barra lateral para los usuarios */}
          <SidebarItem
            icon={<User size={20} />}
            text="Usuarios"
            to="/usuarios"
            isActive={currentPath === "/usuarios"}
            collapsed={collapsed}
          />
          {/* Elemento de la barra lateral para las nuevas cuentas */}
          <SidebarItem
            icon={<FileText size={20} />}
            text="Nuevas cuentas"
            to="/nuevas-cuentas"
            isActive={currentPath === "/nuevas-cuentas"}
            collapsed={collapsed}
          />
        </nav>
      </div>
      <div className="sidebar-footer">
        {" "}
        {/* Pie de página de la barra lateral */}
        <Link to="/login" className={`logout-button ${collapsed ? "collapsed" : ""}`}>
          {" "}
          {/* Botón de cierre de sesión */}
          <LogOut size={20} /> {/* Ícono de cierre de sesión */}
          {!collapsed && <span>Salir</span>} {/* Texto del botón, oculto cuando está colapsado */}
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar // Exporta el componente Sidebar

