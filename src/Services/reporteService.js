import axios from "axios";

const API_URL_BASE = `${process.env.REACT_APP_API_VENTAS}/ventas`;

export const obtenerReporteClientes = () => {
    return axios.get(`${API_URL_BASE}/reporte-clientes`);
};

export const obtenerVentasGenerales = () => {
    return axios.get(`${API_URL_BASE}/listar`);
};