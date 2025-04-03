import api from "./api";

const endpoint = "/espacios";


export const contarEspacios =async () =>{
    return await api.get(`${endpoint}/count`)
}

export const getEspaciosEdificiosid = async (id) => {
    return await api.get(`${endpoint}/edificio/${id}`);
  };