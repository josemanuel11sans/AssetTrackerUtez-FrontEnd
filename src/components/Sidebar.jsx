"use client"

// Importa los hooks y componentes necesarios de React Router y Lucide React
import { useState, useEffect, useCallback } from "react" // Añadir useState para manejar el estado de colapso
import { useLocation, Link } from "react-router-dom"
import { Home, ClipboardList, Layers, Database, Users, User, FileText, LogOut, ChevronLeft, X } from "lucide-react"
import SidebarItem from "./SidebarItem" // Importa el componente SidebarItem
import "../styles/Sidebar.css" // Importa los estilos CSS para la barra lateral
import LogoComponent from "./LogoComponent" // Importa el componente de logo
import useMediaQuery from "../hooks/useMediaQuery"

// Define el componente Sidebar
const Sidebar = ({ onClose }) => {
  const location = useLocation() // Obtiene la ubicación actual de la ruta
  const currentPath = location.pathname // Obtiene el path actual
  const [collapsed, setCollapsed] = useState(false) // Estado para controlar si el sidebar está colapsado
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Función para alternar el estado de colapso
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const handleMediaQueryChange = useCallback(
    (matches) => {
      if (matches) {
        setCollapsed(true)
      } else if (!isMobile) {
        setCollapsed(false)
      }
    },
    [isMobile],
  )

  // Colapsar automáticamente en pantallas medianas
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px) and (min-width: 769px)")
    handleMediaQueryChange(mediaQuery.matches)

    const listener = (event) => handleMediaQueryChange(event.matches)

    mediaQuery.addEventListener("change", listener)

    return () => {
      mediaQuery.removeEventListener("change", listener)
    }
  }, [handleMediaQueryChange, isMobile])

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
      <div className="sidebar-header">
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
            {isMobile && (
              <button className="close-button" onClick={onClose}>
                <X size={24} />
              </button>
            )}
          </>
        ) : (
          <button className="expand-button" onClick={toggleSidebar}>
            <LogoComponent size="small" />
          </button>
        )}
      </div>
      <div className="sidebar-section">
        <h2 className="section-title">Inventarios</h2>
        <nav className="nav-menu">
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            to="/home"
            isActive={currentPath === "/home" || currentPath === "/"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
          <SidebarItem
            icon={<ClipboardList size={20} />}
            text="Gestión de inventarios"
            to="/gestion-inventarios"
            isActive={currentPath === "/gestion-inventarios"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
          <SidebarItem
            icon={<Layers size={20} />}
            text="Categorías de espacios"
            to="/categorias-espacios"
            isActive={currentPath === "/categorias-espacios"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
          <SidebarItem
            icon={<Database size={20} />}
            text="Categoría de recursos"
            to="/categoria-recursos"
            isActive={currentPath === "/categoria-recursos"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Responsables"
            to="/responsables"
            isActive={currentPath === "/responsables"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
        </nav>
      </div>
      <div className="sidebar-section">
        <h2 className="section-title">Sistema</h2>
        <nav className="nav-menu">
          <SidebarItem
            icon={<User size={20} />}
            text="Usuarios"
            to="/usuarios"
            isActive={currentPath === "/usuarios"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            text="Nuevas cuentas"
            to="/nuevas-cuentas"
            isActive={currentPath === "/nuevas-cuentas"}
            collapsed={collapsed}
            onClick={isMobile ? onClose : undefined}
          />
        </nav>
      </div>
      <div className="sidebar-footer">
        <Link
          to="/login"
          className={`logout-button ${collapsed ? "collapsed" : ""}`}
          onClick={isMobile ? onClose : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Salir</span>}
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar

