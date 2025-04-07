import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Login.css"; 
import logo from "../assets/logoWithoutText.png"; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const {handleLogin} = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado con:", { correo, password });
    await handleLogin(correo, password);
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/home"); // Redirige solo si hay token
    } else {
      toast.error("Error: Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box fixed-box">
        {/* Lado izquierdo: Imagen o ilustración */}
        <div className="illustrationLogin">
          <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img2" />
          <h1 className="titleIllustration">AssetTracker UTEZ</h1>
          <p className="subtitleIllustration">Gestiona tus recursos eficientemente</p>
        </div>
        {/* Lado derecho: Formulario de login */}
        <div className="form-containerLogin">
          <h1 className="title2">Iniciar Sesión</h1>
          <p className="description">Bienvenido de nuevo, por favor complete los campos</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Correo:</label>
              <div className="input-container">
                <Mail className="icon" size={20} color="#aaa " />
                <input 
                  type="email" 
                  placeholder="ejemplo@utez.edu.mx" 
                  value={correo}
                  onChange={handleCorreoChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Contraseña:</label>
              <div className="input-container">
                <Lock className="icon" size={20} color="#aaa " />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="• • • • • • • •" 
                  value={password}
                  onChange={handlePasswordChange}
                  required 
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} color="#aaa" /> : <EyeOff size={20} color="#aaa" />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-button">
              Entrar
            </button>
            <div className="links">
              <p>
                ¿No tienes una cuenta?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/registro");
                  }}
                >
                  Regístrate
                </a>
              </p>
              {/*<a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/recuperar-contrasena");
                  }}
                >¿Olvidaste tu contraseña?
              </a>*/}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
