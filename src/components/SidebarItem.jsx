import { Link } from "react-router-dom"
import "../styles/SidebarItem.css"

const SidebarItem = ({ icon, text, to, isActive }) => {
  return (
    <Link to={to} className={`sidebar-item ${isActive ? "active" : ""}`}>
      <div className="sidebar-icon">{icon}</div>
      <span className="sidebar-text">{text}</span>
    </Link>
  )
}

export default SidebarItem

