import api from './api';

const endpoint ='/categoriasRecursos';

export const getCategoriasRecursos = async () =>{
    return await api.get(`${endpoint}/all`);
}