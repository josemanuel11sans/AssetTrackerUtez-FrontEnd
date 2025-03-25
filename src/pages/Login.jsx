import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Login.css"; // Asegúrate de que el archivo CSS esté correctamente enlazado

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);
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
        <div className="illustration">
          {/* Aquí puedes agregar una imagen, por ejemplo */}
          <h1 className="title">AssetTracker</h1>
          <h2 className="subtitle">UTEZ</h2>
        </div>

        {/* Lado derecho: Formulario de login */}
        <div className="form-container">
          <h1 className="title2">Inicio de Sesión</h1>
          <p className="description">
            Bienvenido, por favor ingresa tu cuenta para acceder.
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Correo:</label>
              <input
                type="email"
                placeholder="ejemplo@utez.edu.mx"
                value={correo}
                onChange={handleCorreoChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Contraseña:</label>
              <input
                type="password"
                placeholder=". . . . . . ."
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="links">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit" className="login-button">
              Entrar
            </button>
            <div className="links">
              <p>
                ¿Nuevo usuario? <a href="#">Crear una cuenta</a>
              </p>
            </div>
          </form>
          
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
