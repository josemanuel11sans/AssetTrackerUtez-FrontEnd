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