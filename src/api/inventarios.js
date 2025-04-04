import api from "./api";

const endpoint = "inventariosLevantados";

export const contarInventarios = async () =>{
    return await  api.get(`${endpoint}/count`)
}


export const getInventariosEspacios = async (id) =>{
    return await  api.get(`${endpoint}/espacio/${id}`)
}
