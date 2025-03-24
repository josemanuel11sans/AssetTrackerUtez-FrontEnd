import axios from "axios";
import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [error, setError] = useState(null);

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post(
                'https://3a76hppbug.execute-api.us-east-1.amazonaws.com/auth/login',
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('ruta :)')
    
            if (response.status === 200) {
                // Guarda el token JWT en localStorage
                localStorage.setItem("jwt", response.data.token);
                
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setError(null);
    
            } else if (response.status === 401) {
                setUser(null);
                setError(true);
            }
        } catch (err) {
            console.log('Error en la conexión:', err);
            setError(true);
            setUser(null);
        }
    };
    

    const handleLogout = () => {
        setUser(null);
        logout();
        localStorage.removeItem("user"); // Eliminar usuario al cerrar sesión
    };

    return (
        <AuthContext.Provider value={{ user, handleLogout, handleLogin, error }}>
            {children}
        </AuthContext.Provider>
    );
};