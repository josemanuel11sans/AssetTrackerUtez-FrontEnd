import api from "./api";

const endpoint = "/recursos";

export const contarRecursos = async () =>{
    return await api.get(`${endpoint}/count`)
}
export const getRecursosInventarioId = async (id) => {
  try {
    const response = await api.get(`${endpoint}/inventario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los recursos del inventario:", error);
    throw error;
  }
};
export const getRecursos = async () =>{
    return await api.get(`${endpoint}/all`)
}

export const saveRecurso = async (recurso) => {
  try {
    const response = await api.post("/recursos/save", recurso, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar el recurso:", error);
    throw error;
  }
};