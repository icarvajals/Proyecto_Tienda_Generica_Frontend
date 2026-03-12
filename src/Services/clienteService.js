import axios from "axios";

const API_URL_BASE = "http://localhost:8081/clientes";

export const listarClientes = () => {
    return axios.get(`${API_URL_BASE}/listar`);
}

export const guardarCliente = (cliente) => {
    return axios.post(`${API_URL_BASE}/guardar`, cliente);
}

export const eliminarCliente = (id) => {
    return axios.delete(`${API_URL_BASE}/eliminar/${id}`);
};

export const buscarCliente = (cedula) => {
    return axios.get(`${API_URL_BASE}/buscar/${cedula}`);
}

export const actualizarCliente = (cliente) => {
    return axios.put(`${API_URL_BASE}/actualizar`, cliente);
}
