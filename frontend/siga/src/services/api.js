import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
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
    // ensure credentials are sent so httpOnly refresh cookie is included
    config.withCredentials = true;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Try refresh token flow (using httpOnly cookie)
      const originalRequest = error.config;

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return api.post('/auth/refresh', {}, { withCredentials: true })
          .then((res) => {
            const newToken = res.data.token;
            if (newToken) {
              localStorage.setItem('token', newToken);
              api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
            // fallback to logout
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("usuario");
            setAuthToken(null);
            if (globalThis.location.pathname !== "/") {
              globalThis.location.href = "/";
            }
          })
          .catch(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("usuario");
            setAuthToken(null);
            if (globalThis.location.pathname !== "/") {
              globalThis.location.href = "/";
            }
          });
      }
    }

    return Promise.reject(error);
  }
);

export default api;