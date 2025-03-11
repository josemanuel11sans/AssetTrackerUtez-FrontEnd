import { useLocation, Link } from "react-router-dom"
import { Home, ClipboardList, Layers, Database, Users, User, FileText, LogOut } from "lucide-react"
import SidebarItem from "./SidebarItem"
import "../styles/Sidebar.css"

const Sidebar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">AssetTracker</h1>
        <p className="app-subtitle">UTEZ</p>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">Inventarios</h2>
        <nav className="nav-menu">
          <SidebarItem icon={<Home size={20} />} text="Home" to="/" isActive={currentPath === "/"} />
          <SidebarItem
            icon={<ClipboardList size={20} />}
            text="Gestión de inventarios"
            to="/gestion-inventarios"
            isActive={currentPath === "/gestion-inventarios"}
          />
          <SidebarItem
            icon={<Layers size={20} />}
            text="Categorías de espacios"
            to="/categorias-espacios"
            isActive={currentPath === "/categorias-espacios"}
          />
          <SidebarItem
            icon={<Database size={20} />}
            text="Categoría de recursos"
            to="/categoria-recursos"
            isActive={currentPath === "/categoria-recursos"}
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Responsables"
            to="/responsables"
            isActive={currentPath === "/responsables"}
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
          />
          <SidebarItem
            icon={<FileText size={20} />}
            text="Nuevas cuentas"
            to="/nuevas-cuentas"
            isActive={currentPath === "/nuevas-cuentas"}
          />
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link to="/logout" className="logout-button">
          <LogOut size={20} />
          <span>Salir</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar

