import axios from "axios";

const VENTA_API_URL = "http://localhost:8085/ventas"; 
const DETALLE_API_URL = "http://localhost:8085/api/detalleventas";

const apiVentas = axios.create({
    headers: { 'Content-Type': 'application/json' }
});

export const guardarVenta = (venta) => {
    return apiVentas.post(`${VENTA_API_URL}/agregar`, venta);
};

export const guardarDetalleVenta = (detalle) => {
    return apiVentas.post(`${DETALLE_API_URL}/agregar`, detalle);
};