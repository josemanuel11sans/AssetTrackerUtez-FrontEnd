import api from "./api";

const endpoint = "/espacios";


export const contarEspacios =async () =>{
    return await api.get(`${endpoint}/count`)
}