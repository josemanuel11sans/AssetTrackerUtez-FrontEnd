import React, {useState }from 'react';
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import "../styles/PrincipalPages.css";
import logo from "../assets/textLogo.png";

const CambioContrasena = () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    return (
        <div className="container">
            <div className="box fixed-box">
                {/* Lado izquierdo: Imagen o ilustración */}
                <div className="illustration">
                    <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img" />
                    <h1 className="title">Es hora de empezar de nuevo. Crea tu nueva contraseña</h1>
                    </div>
                {/* Lado derecho: Formulario de cambio de contraseña */}
                <div className="form-container">
                    <h1 className="title2">Cambiar Contraseña</h1>
                    <p className="description">Por favor complete los campos para cambiar su contraseña</p>
                    <form className="form">
                    <div className="input-group">
                                <label>Nueva contraseña:</label>
                                <div className="input-container">
                                    <Lock className="icon" size={20} color="#aaa" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder=". . . . . . ." 
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
                            <div className="input-group">
                                <label>Repetir contraseña:</label>
                                <div className="input-container">
                                    <Lock className="icon" size={20} color="#aaa" />
                                    <input 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder=". . . . . . ." 
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        required 
                                    />
                                    <button
                                        type="button"
                                        className="eye-button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <Eye size={20} color="#aaa" /> : <EyeOff size={20} color="#aaa" />}
                                    </button>
                                </div>
                            </div>
                        <button 
                            type="submit" 
                            className="button" 
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/");
                            }}>
                            Confirmar contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CambioContrasena;
