import axios from "axios";

const API_URL_BASE = "https://ms-ventas-production.up.railway.app/ventas";

export const obtenerReporteClientes = () => {
    return axios.get(`${API_URL_BASE}/reporte-clientes`);
};

export const obtenerVentasGenerales = () => {
    return axios.get(`${API_URL_BASE}/listar`);
};