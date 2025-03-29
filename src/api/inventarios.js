import api from "./api";

const endpoint = "/inventariosLevantados";

export const contarInventarios = async () =>{
    return await  api.get(`${endpoint}/count`)
}

