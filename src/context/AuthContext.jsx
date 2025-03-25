import React, { createContext, useState, useEffect } from "react";
import { login } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const storedJwt = localStorage.getItem("jwt");
    const storedExpiration = localStorage.getItem("expiration");

    console.log("Recuperando datos del localStorage:");
    console.log("User:", storedUser);
    console.log("JWT:", storedJwt);
    console.log("Expiration:", storedExpiration);

    // Si tenemos un usuario almacenado y el JWT no ha expirado, lo recuperamos
    if (storedUser && storedJwt && storedExpiration) {
      const currentTime = Date.now();
      console.log("Tiempo actual:", currentTime);
      if (currentTime < storedExpiration) {
        console.log("El token no ha expirado, recuperando usuario.");
        return JSON.parse(storedUser);
      } else {
        // Si el token ha expirado, limpiar y devolver null
        console.log("El token ha expirado, limpiando localStorage.");
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
        localStorage.removeItem("expiration");
        return null;
      }
    }
    return null;
  });

  const [error, setError] = useState(null);

  // Función para manejar el login
  const handleLogin = async (correo, password) => {
    console.log("Intentando iniciar sesión con:", correo);
    try {
      const response = await login({ correo, password });
      console.log("Respuesta del login:", response);
      if (response.status === 200) {
        // Guardar el JWT y el usuario en el localStorage
        const { jwt, username, expiration } = response.data;
        console.log("Datos recibidos del backend:");
        console.log("Token:", jwt);
        console.log("Usuario:", username);
        console.log("Expiración:", expiration);

        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify({username}));
        localStorage.setItem("expiration", Date.now() + expiration); // Guardar el tiempo de expiración

        console.log("Datos almacenados en localStorage:");
        console.log("JWT:", localStorage.getItem("jwt"));
        console.log("User:", localStorage.getItem("user"));
        console.log("Expiration:", localStorage.getItem("expiration"));

        setUser({username});
        setError(null);
      } 
    } catch (err) {
      console.error("Error en la conexión:", err);
      setError(true);
      setUser(null);
    }
  };

  // Función para manejar el logout
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("expiration");

    console.log("Datos eliminados del localStorage.");
    console.log("User:", localStorage.getItem("user"));
    console.log("JWT:", localStorage.getItem("jwt"));
    console.log("Expiration:", localStorage.getItem("expiration"));
  };

  // Comprobar si el token ha expirado al cargar la aplicación
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedExpiration = localStorage.getItem("expiration");
      const currentTime = Date.now();

      console.log("Comprobando expiración del token...");
      console.log("Tiempo actual:", currentTime);
      console.log("Fecha de expiración almacenada:", storedExpiration);

      if (storedExpiration && currentTime > storedExpiration) {
        console.log("El token ha expirado, procediendo a hacer logout.");
        handleLogout();
      }
    };

    checkTokenExpiration();
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleLogout, handleLogin, error }}>
      {children}
    </AuthContext.Provider>
  );
};
