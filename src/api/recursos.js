import api from "./api";

const endpoint = "/recursos";

export const contarRecursos = async () =>{
    return await api.get(`${endpoint}/count`)
}
export const getRecursosInventarioId = async (id) =>{
    return await api.get(`${endpoint}/inventario/${id}`)
}
export const getRecursos = async () =>{
    return await api.get(`${endpoint}/all`)
}