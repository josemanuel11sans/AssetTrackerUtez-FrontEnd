import api from './api';

const endpoint ='/responsables';

export const getResponsables = async () =>{
    return await api.get(`${endpoint}/all`);
}

export const getResponsable = async (id) =>{
    return await api.get(`${endpoint}/${id}`);
}

export const saveResponsable = async (responsable) => {
  try {
    const url = responsable.id 
      ? `${endpoint}/update` // Endpoint para actualizar
      : `${endpoint}/save`; // Endpoint para crear

    const method = responsable.id ? "put" : "post"; // Método HTTP dinámico

    const response = await api[method](url, responsable, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar o actualizar el responsable:", error);
    throw error;
  }
};

export const changeStatusResponsable = async (id) => {
  try {
    const response = await api.put(
      `${endpoint}/changeStatus`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del responsable:", error);
    throw error;
  }
};