
import api from './api';

const endpoint ='/categoriasRecursos';
//traer todas las categorias de recursos
export const getCategoriasRecursos = async () =>{
    return await api.get(`${endpoint}/all`);
}
//guardar una nueva caegoria de recursos
export const crearCategoriaRecursos = async (nombre, material, file) => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("material", material);
    formData.append("file", file); // Asegúrate de que "file" sea el nombre que espera el backend
  
    // Usamos api (tu instancia de Axios), pero sobrescribimos headers para esta petición
    const response = await api.post("categoriasRecursos/save", formData, {
      headers: {
        // Eliminamos 'Content-Type': 'application/json' para que Axios lo ajuste automáticamente
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`, // Opcional, ya que el interceptor lo añade
      },
    });
  
    return response.data;
  };