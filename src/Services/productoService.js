import axios from "axios";

const API_URL_BASE = `${process.env.REACT_APP_API_PRODUCTOS}/api/productos`; 

// Creamos una instancia de axios configurada para enviar JSON
const api = axios.create({
    baseURL: API_URL_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const listarProductos = () => api.get("/listar");
export const guardarProducto = (producto) => api.post("/agregar", producto);
export const eliminarProducto = (codigo) => api.delete(`/borrar/${codigo}`);
export const buscarProducto = (codigo) => api.get(`/buscar/${codigo}`);
export const actualizarProducto = (id, producto) => api.put(`/actualizar/${id}`, producto);