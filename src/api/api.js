// api.js
import axios from "axios";

const API_BASE_URL = "https://3a76hppbug.execute-api.us-east-1.amazonaws.com/";
// Usar el URL de desarrollo local (si corresponde)
// const API_BASE_URL = "http://localhost:5000/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    // console.log("Token en el request interceptor:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // console.error("Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // console.log("Respuesta de la API:", response);
    return response;
  },
  (error) => {
    // console.error("Error en la respuesta de la API:", error);
    return Promise.reject(error);
  }
);

export default api;
