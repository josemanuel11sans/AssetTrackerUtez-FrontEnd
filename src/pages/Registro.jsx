import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Briefcase, EyeOff, Eye } from "lucide-react";
import "../styles/PrincipalPages.css";
import logo from "../assets/logoWithoutText.png";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("Administrador");
    const [error, setError] = useState(null);
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
                <div className="illustrationLogin">
                    <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img2" />
                    <h1 className="titleIllustration">AssetTracker UTEZ</h1>
                    <p className="subtitleIllustration">Accede a tus recursos académicos. ¡Únete ahora!</p>
                </div>
                {/* Lado derecho: Formulario de registro */}
                <div className="form-containerLogin">
                    <h1 className="title2">Registrarse</h1>
                    <p className="description">Por favor complete el formulario para registrarse</p>
                    <form className="form">
                        <div className="input-group">
                            <label>Nombre:</label>
                            <div className="input-container">
                                <User className="icon" size={20} color="#aaa" />
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
                                <User className="icon" size={20} color="#aaa" />
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
                        <div className="input-group">
                            <label>Contraseña:</label>
                            <div className="input-container">
                                <Lock className="icon" size={20} color="#aaa" />
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
                        <div className="input-group">
                            <label>Rol:</label>
                            <div className="input-container ">
                                <Briefcase className="icon" size={20} color="#aaa" />
                                <select className="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                                    <option value="" disabled selected>Selecciona un rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Inspector">Inspector</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit"
                            className="button"
                            onClick={(e) => {
                                e.preventDefault();
                                // Validación del correo
                                const correoValido = /^[a-zA-Z0-9._%+-]+@utez\.edu\.mx$/.test(correo);
                                if (!correoValido) {
                                    setError("Por favor, utiliza un correo institucional válido (@utez.edu.mx)");
                                    return;
                                }
                                navigate("/");
                            }}>
                            Registrarse
                        </button>
                        <div className="links">
                            <p>
                                ¿Ya tienes una cuenta? {" "}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/");
                                    }}>Iniciar sesión</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registro;
