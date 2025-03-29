import api from "./api";

const endpoint = "/recursos";

export const contarRecursos = async () =>{
    return await api.get(`${endpoint}/count`)
}