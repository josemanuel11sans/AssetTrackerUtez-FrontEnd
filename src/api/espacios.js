import api from "./api";

const endpoint = "/espacios";

export const contarEspacios = async () => {
    try {
        const response = await api.get(`${endpoint}/count`);
        return response.data;
    } catch (error) {
        console.error("Error al contar los espacios:", error);
        throw error;
    }
};

export const getEspaciosEdificiosid = async (id) => {
    return await api.get(`${endpoint}/edificio/${id}`);
};

export const saveEspacio = async (nombre, numeroPlanta, file, idEdificio, espacio) => {
    try {
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("numeroPlanta", numeroPlanta);
        formData.append("idEdificio", idEdificio);
        if (file) {
            formData.append("file", file);
        }
        formData.append("categoriaEspacio", espacio);

        const response = await api.post(`${endpoint}/save`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al guardar el espacio:", error);
        throw error;
    }
};

export const updateEspacio = async (id, nombre, numeroPlanta, file, idCategoriaEspacio) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("nombre", nombre);
        formData.append("numeroPlanta", numeroPlanta);
        if (file) {
            formData.append("file", file);
        }
        formData.append("categoriaEspacio", idCategoriaEspacio); // Enviar el ID de la categoría seleccionada
       
        
        const response = await api.put(`${endpoint}/update`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el espacio:", error);
        throw error;
    }
};

export const changeStatusEspacio = async (id) => {
    try {
        const response = await api.put(
            `${endpoint}/changeStatus`,
            { id },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el estado del espacio:", error);
        throw error;
    }
};