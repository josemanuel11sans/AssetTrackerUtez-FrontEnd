"use client"

import { Link } from "react-router-dom"
import "../styles/SidebarItem.css"

const SidebarItem = ({ icon, text, to, isActive, collapsed, onClick }) => {
  return (
    <Link
      to={to}
      className={`sidebar-item ${isActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
      onClick={onClick}
    >
      <div className="sidebar-icon">{icon}</div>
      {!collapsed && <span className="sidebar-text">{text}</span>}
    </Link>
  )
}

export default SidebarItem

