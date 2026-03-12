import axios from "axios";

const API_URL_BASE = "http://localhost:8081/productos";

export const listarProductos = () => {
    return axios.get(`${API_URL_BASE}/listar`);
}

export const guardarProducto = (producto) => {
    return axios.post(`${API_URL_BASE}/guardar`, producto);
}

export const eliminarProducto = (id) => {
    return axios.delete(`${API_URL_BASE}/eliminar/${id}`);
};

export const buscarProducto = (codigo) => {
    return axios.get(`${API_URL_BASE}/buscar/${codigo}`);
}

export const actualizarProducto = (producto) => {
    return axios.put(`${API_URL_BASE}/actualizar`, producto);
}