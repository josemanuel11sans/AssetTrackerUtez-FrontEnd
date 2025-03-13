import Logo from "../assets/logoSiple.svg"
const LogoComponent = ({ size = "default" }) => {
    // Tamaños para el logo según el estado del sidebar
    const width = size === "small" ? 24 : 32
    const height = size === "small" ? 24 : 32
  
    return (
      <div className={`logo ${size}`}>
        {/* Usando la imagen desde la carpeta assets */}
        <img src={Logo} width={width} height={height} className="logo-image" />
      </div>
    )
  }
  
  export default LogoComponent
  
  