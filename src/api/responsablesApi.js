import api from './api';

const endpoint ='/responsables';

export const getResponsables = async () =>{
    return await api.get(`${endpoint}/all`);
}

export const getResponsable = async (id) =>{
    return await api.get(`${endpoint}/${id}`);
}