import api from './api.js'

const endpoint = "/auth";

// Login de usuario
export const login = async (user, password) => {
    return await api.post(`${endpoint}/login`, {
        user: user,
        password: password
    });
};

export const logout = async () => {
    return await api.post(`${endpoint}/logout`);
};