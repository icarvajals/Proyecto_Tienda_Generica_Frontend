import axios from "axios";

const VENTA_API_URL = "https://ms-ventas-production.up.railway.app/ventas"; 
const DETALLE_API_URL = "https://ms-ventas-production.up.railway.app/api/detalleventas";

const apiVentas = axios.create({
    headers: { 'Content-Type': 'application/json' }
});

export const guardarVenta = (venta) => {
    return apiVentas.post(`${VENTA_API_URL}/agregar`, venta);
};

export const guardarDetalleVenta = (detalle) => {
    return apiVentas.post(`${DETALLE_API_URL}/agregar`, detalle);
};