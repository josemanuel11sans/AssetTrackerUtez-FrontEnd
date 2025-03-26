import api from "./api";

const endpoint = "categoriasRecursos";
export const getCategoriasRecursos = async () => {
  return await api.get(`${endpoint}/all`);
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
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría de recursos:");
    throw error;
  }
};
export const chageStatus = async (id) => {
  try {
    const response = await api.put(
      `${endpoint}/status`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al cambiar el estado de la categoría de recursos:",
      error
    );
    throw error;
  }
};
