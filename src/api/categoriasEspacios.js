import api from "./api";
const endpoint = "categoriasEspacios";

export const getCategoriasEspacios = async () =>{
    return await api.get(`${endpoint}/all`);
}

export const chageStatus = async (id) =>{
try{
    const response = await api.put( 
    `${endpoint}/changeStatus`,{ id },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
      }
    )
    return response.data
}catch(error){
    console.error(
        "Error al cambiar el estado de la categoría de Espacios:",
        error
      );
      throw error;
}
}

export const saveCategoriaEspacio = async (nombre, descripcion) => {
  try {
    const payload = { nombre, descripcion };
    const response = await api.post(`${endpoint}/save`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar la categoría de espacios:", error);
    throw error;
  }
};

export const updateCategoriaEspacio = async (id, nombre, descripcion) => {
  try {
    const payload = { id, nombre, descripcion };
    const response = await api.put(`${endpoint}/update`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoría de espacios:", error);
    throw error;
  }
};