import axios from "axios";

// Rutas exactas a tus controladores de Spring Boot
const VENTA_API_URL = "http://localhost:8081/api/ventas";
const DETALLE_API_URL = "http://localhost:8081/api/detalleventas";

const apiVentas = axios.create({
    headers: { 'Content-Type': 'application/json' }
});

// Guardar la cabecera de la factura
export const guardarVenta = (venta) => apiVentas.post(`${VENTA_API_URL}/agregar`, venta);

// Guardar cada producto de la factura
export const guardarDetalleVenta = (detalle) => apiVentas.post(`${DETALLE_API_URL}/agregar`, detalle);