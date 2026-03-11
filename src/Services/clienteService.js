import axios from "axios";

const API_URL_BASE = "http://localhost:8080/clientes";

export const listarClientes = () => {
    return axios.get(`${API_URL_BASE}/listar`);
}

export const guardarCliente = (cliente) => {
    return axios.post(`${API_URL_BASE}/guardar`, cliente);
}

export const eliminarCliente = (id) => {
    return axios.delete(`${API_URL_BASE}/eliminar/${id}`);
};