
import api from './api';

const endpoint ='categoriasRecursos';
//traer todas las categorias de recursos
export const getCategoriasRecursos = async () =>{
    return await api.get(`${endpoint}/all`);
}
//guardar una nueva caegoria de recursos
// Guardar una nueva categoría de recursos
export const crearCategoriaRecursos = async (nombre, material, file) => {
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("material", material);
      formData.append("file", file); // Asegúrate de que "file" sea el nombre que espera el backend
  
      // Usamos api (tu instancia de Axios), no es necesario el Content-Type
      const response = await api.post(`${endpoint}/save`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
          'Content-Type': 'multipart/form-data',
        }
      });
  
      return response.data;
    } catch (error) {
      console.error("Error al crear la categoría de recursos:", error);
      throw error;
    }
  };
  