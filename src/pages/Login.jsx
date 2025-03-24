import React from "react";
import "../styles/Login.css"; 
import {useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { handleLogin } = useContext(AuthContext);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUserChange = (e) => {
        setUser(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(user, password);
    
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate('/home'); // Redirige solo si hay token
        } else {
            console.log("Error: Usuario o contraseña incorrectos.");
        }
    };
    

    return ( 
    <div className="login-container">
        <div className="login-box fixed-box">
            {/* Lado izquierdo */}
            <div className="illustration">
                {/* <img src="../src/assets/login.png" alt="Imagen de Asset Tracker UTEZ" className="illustration-img" /> */}
                <h1 className="title">AssetTracker</h1>
                <h2 className="subtitle">UTEZ</h2>
            </div>
            {/* Lado derecho */}
            <div className="form-container">
                <h1 className="title2">Inicio de Sesión</h1>
                <p className="description">Bienvenido, por favor ingresa tu cuenta para acceder.</p>
                <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Correo:</label>
                    <input type="email" placeholder="ejemplo@utez.edu.mx" onChange={handleUserChange}/>
                </div>
                <div className="input-group">
                    <label>Contraseña:</label>
                    <input type="password" placeholder=". . . . . . ." onChange={handlePasswordChange}/>
                </div>
                <div className="links">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" className="login-button">Entrar</button>
                <div className="links">
                    <p>¿Nuevo usuario? <a href="#">Crear una cuenta</a></p>
                </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default Login;