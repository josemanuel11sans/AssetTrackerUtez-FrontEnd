import React, {useState }from 'react';
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import "../styles/PrincipalPages.css";
import logo from "../assets/textLogo.png";

const CodigoRecuperacion = () => {
    const [codigo, setCodigo] = useState("");
    const navigate = useNavigate();

    const handleCodigoChange = (e) => {
        setCodigo(e.target.value);
    }   

    return (
        <div className="container">
            <div className="box fixed-box">
                {/* Lado izquierdo: Imagen o ilustración */}
                <div className="illustration">
                    <img src={logo} alt="Imagen de Asset Tracker UTEZ" className="illustration-img" />
                    <h1 className="title">No te preocupes, recupera tu cuenta fácilmente</h1>
                    </div>
                {/* Lado derecho: Formulario de código de verificación */}
                <div className="form-container">
                    <h1 className="title2">Código de Verificación</h1>
                    <p className="description">Por favor complete el campo para verificar el código</p>
                    <form className="form">
                            <div className="input-group">
                                <label>Correo:</label>
                                <div className="input-container">
                                    <MessageSquare className="icon" size={20} color="#aaa" />
                                    <input 
                                        type="text" 
                                        placeholder=". . . . ." 
                                        value={codigo}
                                        onChange={handleCodigoChange}
                                        required
                                    />
                                </div>
                            </div>
                        <button type="submit" 
                            className="button" 
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/cambio-contrasena");
                            }}>
                            Verificar código
                        </button>
                        <div className="links">
                            <p>
                                ¿No recibiste el código? {" "}
                                <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/recuperar-contrasena");
                                }}>Volver a enviar</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CodigoRecuperacion;