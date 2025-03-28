import React, {useState }from 'react';
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Briefcase, EyeOff, Eye } from "lucide-react";
import "../styles/PrincipalPages.css";
import logo from "../assets/textLogo.png";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("Administrador");
    const navigate = useNavigate();
    
    const handleNombreChange = (e) => {
        setNombre(e.target.value);
    };

    const handleApellidosChange = (e) => {
    setApellidos(e.target.value);
    };

    const handleCorreoChange = (e) => {
        setCorreo(e.target.value);
    }   
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="container">
            <div className="box fixed-box">
                {/* Lado izquierdo: Imagen o ilustración */}
                <div className="illustration">
                <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img" />
                <h1 className="title">Forma parte de la familia AssetTracker</h1>
                </div>
                {/* Lado derecho: Formulario de registro */}
                <div className="form-container">
                <h1 className="title2">Registrarse</h1>
                <p className="description">Por favor complete el formulario para registrarse</p>
                <form className="form">
                        <div className="form-scroll">
                            <div className="input-group">
                                <label>Nombre:</label>
                                <div className="input-container">
                                    <User className="icon" size={20} color="#133E87 " />
                                    <input 
                                        type="text" 
                                        placeholder="Nombre(s)" 
                                        value={nombre}
                                        onChange={handleNombreChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Apellidos:</label>
                                <div className="input-container">
                                    <User className="icon" size={20} color="#133E87 " />
                                    <input 
                                        type="text" 
                                        placeholder="Apellidos" 
                                        value={apellidos}
                                        onChange={handleApellidosChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Correo:</label>
                                <div className="input-container">
                                    <Mail className="icon" size={20} color="#133E87 " />
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
                                    <Lock className="icon" size={20} color="#133E87 " />
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
                                        {showPassword ? <Eye size={20} color="#133E87" /> : <EyeOff size={20} color="#133E87" />}
                                    </button>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Rol:</label>
                                <div className="input-container ">
                                    <Briefcase className="icon" size={20} color="#133E87 " />
                                    <select className="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                                        <option value="" disabled selected>Selecciona un rol</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Inspector">Inspector</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="button">
                            Registrarse
                        </button>
                        <div className="links">
                            <p>
                                ¿Ya tienes una cuenta? <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/");
                                }}
                                className="link-button">Iniciar sesión</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registro;
