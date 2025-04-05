import api from './api';

const endpoint = '/usuarios';

export const getUsuarios = async () => {
    return await api.get(`${endpoint}/all`);
};

export const getUsuario = async (id) => {
    return await api.get(`${endpoint}/${id}`);
};

// Función para guardar un nuevo usuario
export const saveUsuario = async (usuario) => {
    const payload = {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        rol: usuario.rol
    };
    return await api.post(`${endpoint}/save`, payload);
};

// Función para actualizar un usuario existente
export const updateUsuario = async (usuario) => {
    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        rol: usuario.rol
    };
    return await api.put(`${endpoint}/update`, payload);
};

// Función para cambiar el estado de un usuario
export const changeStatusUsuario = async (id) => {
    const payload = { id };
    return await api.put(`${endpoint}/changeStatus`, payload);
};