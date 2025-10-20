// src/config/axiosClientPublic.js
import axios from "axios";

const axiosClientPublic = axios.create({
  baseURL: "https://mitiendaenlineamx.com.mx/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosClientPublic.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error("❌ Error de respuesta:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("⚠️ Sin respuesta del servidor:", err.request);
    } else {
      console.error("💥 Error de configuración:", err.message);
    }
    return Promise.reject(err);
  }
);

export default axiosClientPublic;
