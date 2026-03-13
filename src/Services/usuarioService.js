import axios from "axios";

const API_URL_BASE = "http://localhost:8081/usuarios";

export const guardarUsuario = (usuario) => {
    return axios.post(`${API_URL_BASE}/guardar`, usuario);
};

export const listarUsuarios = () => {
    return axios.get(`${API_URL_BASE}/listar`);
};

export const buscarUsuario = (cedula) => {
    return axios.get(`${API_URL_BASE}/buscar/${cedula}`);
};

export const actualizarUsuario = (usuario) => {
    return axios.put(`${API_URL_BASE}/actualizar`, usuario);
};

export const eliminarUsuario = (id) => {
    return axios.delete(`${API_URL_BASE}/eliminar/${id}`);
};