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
    const response = await api.post(`${endpoint}/save`, responsable, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar el responsable:", error);
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