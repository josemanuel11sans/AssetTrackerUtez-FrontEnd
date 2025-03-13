import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Importa el Router de react-router-dom
import App from "./App";

// Envuelve el componente App con el Router
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router> {/* Aquí envuelves App con BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
);
