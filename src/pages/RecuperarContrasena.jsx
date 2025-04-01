import React, {useState }from 'react';
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import "../styles/PrincipalPages.css";
import logo from "../assets/textLogo.png";

const RecuperarContrasena = () => {
    const [correo, setCorreo] = useState("");
    const navigate = useNavigate();
    
    const handleCorreoChange = (e) => {
        setCorreo(e.target.value);
    }   

    return (
        <div className="container">
            <div className="box fixed-box">
                {/* Lado izquierdo: Imagen o ilustración */}
                <div className="illustration">
                    <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img" />
                    <h1 className="title">Tu cuenta te espera, actualiza tu acceso</h1>
                    </div>
                {/* Lado derecho: Formulario de recuperar contraseña */}
                <div className="form-container">
                    <h1 className="title2">Recuperar Contraseña</h1>
                    <p className="description">Por favor ingresa un correo electrónico para enviar el código</p>
                    <form className="form">
                            <div className="input-group">
                                <label>Correo:</label>
                                <div className="input-container">
                                    <Mail className="icon" size={20} color="#aaa" />
                                    <input 
                                        type="email" 
                                        placeholder="ejemplo@utez.edu.mx" 
                                        value={correo}
                                        onChange={handleCorreoChange}
                                        required
                                    />
                                </div>
                            </div>
                        <button 
                            type="submit" 
                            className="button" 
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/codigo-verificacion");
                            }}>
                            Enviar código
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContrasena;
