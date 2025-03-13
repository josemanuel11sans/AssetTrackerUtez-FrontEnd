import { Link } from "react-router-dom"
import "../styles/SidebarItem.css"

const SidebarItem = ({ icon, text, to, isActive, collapsed }) => {
  return (
    <Link to={to} className={`sidebar-item ${isActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-icon">{icon}</div>
      {!collapsed && <span className="sidebar-text">{text}</span>}
    </Link>
  )
}

export default SidebarItem

