import axios from "axios";

const VENTA_API_URL = `${process.env.REACT_APP_API_VENTAS}/ventas`; 
const DETALLE_API_URL =  `${process.env.REACT_APP_API_VENTAS}/api/detalleventas`;


const apiVentas = axios.create({
    headers: { 'Content-Type': 'application/json' }
});

export const guardarVenta = (venta) => {
    return apiVentas.post(`${VENTA_API_URL}/agregar`, venta);
};

export const guardarDetalleVenta = (detalle) => {
    return apiVentas.post(`${DETALLE_API_URL}/agregar`, detalle);
};