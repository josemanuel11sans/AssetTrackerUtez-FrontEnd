
import { RoutesConfig } from "./routes/RoutesConfig.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
function App() {
  return (

    <AuthProvider>
      <RoutesConfig />
    </AuthProvider>
  );
}

export default App;

