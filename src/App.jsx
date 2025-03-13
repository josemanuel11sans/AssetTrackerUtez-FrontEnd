import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RoutesConfig from "./route/RoutesConfig";  // Importa las rutas desde el archivo separado
import "./App.css";

function App() {
  const location = useLocation();  // Ahora está dentro de un contexto de Router

  // Las rutas donde no queremos mostrar el Sidebar
  const noSidebarRoutes = ["/login", "/404"];

  // Verifica si la ruta actual no debe mostrar el Sidebar
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowSidebar && <Sidebar />} {/* Muestra el Sidebar solo si la ruta no está en la lista */}
      <main className="content">
        <Routes>
          {RoutesConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
