import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || (api.defaults.headers.common.Authorization || "").replace(/^Bearer\s+/i, "");

  if (token) {
    // CORRECCIÓN 1: Evitamos el objeto vacío y asignamos la cabecera de forma directa y limpia
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("usuario");
      setAuthToken(null);

      // CORRECCIÓN 2: Reemplazamos 'window' por 'globalThis' (El estándar moderno de JS)
      if (globalThis.location.pathname !== "/") {
        globalThis.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;