import api from "./api";

const endpoint = "categoriasRecursos";

export const getCategoriasRecursos = async () => {
  try {
    const response = await api.get(`${endpoint}/all`);
    return Array.isArray(response.data.result) ? response.data.result : []; // Devuelve un array vacío si no es válido
  } catch (error) {
    console.error("Error al obtener las categorías de recursos:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const crearCategoriaRecursos = async (nombre, material, file) => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("material", material);
    formData.append("file", file);
    const response = await api.post(`${endpoint}/save`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return Array.isArray(response.data.result) ? response.data.result : []; // Devuelve las categorías actualizadas
  } catch (error) {
    console.error("Error al crear la categoría de recursos:", error);
    throw error;
  }
};

export const chageStatus = async (id) => {
  try {
    const payload = { id };
    const response = await api.put(`/categoriasRecursos/status`, payload);
    return Array.isArray(response.data.result) ? response.data.result : []; // Devuelve las categorías actualizadas
  } catch (error) {
    console.error("Error al cambiar el estado de la categoría:", error);
    throw error;
  }
};

export const updateCategoria = async (id, nombre, material, file) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("material", material);
 
      formData.append("file", file);
    

    const response = await api.post(`${endpoint}/update`, formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Array.isArray(response.data.result) ? response.data.result : []; // Devuelve las categorías actualizadas
  } catch (error) {
    console.error("Error al actualizar la categoría de recursos:", error);
    throw error;
  }
};