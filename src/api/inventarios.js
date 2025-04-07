import api from "./api";

const endpoint = "inventariosLevantados";

export const contarInventarios = async () => {
  return await api.get(`${endpoint}/count`);
};

export const getInventariosEspacios = async (id) => {
  return await api.get(`${endpoint}/espacio/${id}`);
};

export const saveInventario = async (formData) => {
  try {
    console.log("formData", formData);
    
    const response = await api.post(`${endpoint}/save`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar el inventario:", error);
    throw error;
  }
};

export const updateInventario = async (formData) => {
  try {
    const response = await api.put(`${endpoint}/update`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el inventario:", error);
    throw error;
  }
};

export const changeStatusInventario = async (id) => {
  try {
    const response = await api.put(
      `${endpoint}/status`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del inventario:", error);
    throw error;
  }
};

