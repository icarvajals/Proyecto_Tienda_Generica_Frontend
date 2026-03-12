import axios from "axios";

const API_URL_BASE = "http://localhost:8081/proveedores";

export const listarProveedores = () => {
    return axios.get(`${API_URL_BASE}/listar`);
}

export const guardarProveedor = (proveedor) => {
    return axios.post(`${API_URL_BASE}/guardar`, proveedor);
}

export const eliminarProveedor = (id) => {
    return axios.delete(`${API_URL_BASE}/eliminar/${id}`);
};

export const buscarProveedor = (nit) => {
    return axios.get(`${API_URL_BASE}/buscar/${nit}`);
}

export const actualizarProveedor = (proveedor) => {
    return axios.put(`${API_URL_BASE}/actualizar`, proveedor);
}