import api from './api';

const endpoint = '/notificaciones';

export const getNotificaciones = async () => {
    return await api.get(`${endpoint}/all`);
};

// Función para aprobar una cuenta
export const aprobarCuenta = async (idNoti, idUser) => {
    const payload = {
        id: idNoti,
        usuario: {
            id: idUser,
        }
    };
    return await api.put(`${endpoint}/aprobar`, payload);
};

// Función para rechazar una cuenta
export const rechazarCuenta = async (idNoti, idUser) => {
    const payload = {
        id: idNoti,
        usuario: {
            id: idUser,
        }
    };
    return await api.put(`${endpoint}/rechazar`, payload);
};