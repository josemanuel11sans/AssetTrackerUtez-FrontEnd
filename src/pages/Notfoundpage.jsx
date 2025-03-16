
import { useEffect, useState } from "react"
import "../styles/NotFoundPage.css"

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="not-found-container">
      <div
        className="not-found-content"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <h1 className="error-code">404</h1>
        <div className="error-line"></div>
        <h2 className="error-message">Página no encontrada</h2>
        <p className="error-description">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <a href="/" className="back-button">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

