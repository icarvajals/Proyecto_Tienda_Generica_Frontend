import axios from "axios";

const API_URL_BASE = "http://localhost:8081/ventas";

export const obtenerReporteClientes = () => {
    return axios.get(`${API_URL_BASE}/reporte-clientes`);
};

export const obtenerVentasGenerales = () => {
    return axios.get(`${API_URL_BASE}/listar`);
};