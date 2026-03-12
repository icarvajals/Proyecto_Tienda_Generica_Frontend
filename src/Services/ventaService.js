import axios from "axios";

const API_URL_BASE = "http://localhost:8081/ventas";

export const guardarVenta = (venta) => {
    return axios.post(`${API_URL_BASE}/guardar`, venta);
};

export const obtenerUltimoCodigo = () => {
    return axios.get(`${API_URL_BASE}/ultimo-codigo`);
};