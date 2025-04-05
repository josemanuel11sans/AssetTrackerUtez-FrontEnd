import api from "./api";

const endpoint = "/edificios";

export const getEdificios = async () => {
  return await api.get(`${endpoint}/all`);
};

export const getEdificiosid = async (id) => {
  return await api.get(`${endpoint}/${id}`);
};

export const chageStatus = async (id) => {
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
    console.error("Error al cambiar el estado del edificio:", error);
    throw error;
  }
};

export const crearEdificio = async (formData) => {
  try {
    const response = await api.post(`${endpoint}/save`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el edificio:", error);
    throw error;
  }
};

export const actualizarEdificio = async (formData) => {
  try {
    const response = await api.put(`${endpoint}/update`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el edificio:", error);
    throw error;
  }
};

export const contarEdificios = async () => {
  return await api.get(`${endpoint}/count`);
};
