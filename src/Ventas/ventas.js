import React, { useState, useEffect } from "react";
import MenuPrincipal from "../Menu/menuPrincipal";
import "./ventas.css";
import { buscarCliente } from "../Services/clienteService";
import { buscarProducto } from "../Services/productoService";
import { guardarVenta, guardarDetalleVenta } from "../Services/ventaService";

function Ventas() {
    const [cedulaCliente, setCedulaCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [productos, setProductos] = useState([
        { codigo: "", nombre: "", cantidad: "", precio: 0, iva: 0, valorTotal: 0 },
        { codigo: "", nombre: "", cantidad: "", precio: 0, iva: 0, valorTotal: 0 },
        { codigo: "", nombre: "", cantidad: "", precio: 0, iva: 0, valorTotal: 0 }
    ]);
    const [totalVenta, setTotalVenta] = useState(0);
    const [totalIva, setTotalIva] = useState(0);
    const [totalConIva, setTotalConIva] = useState(0);

    useEffect(() => {
        let subtotal = 0;
        let ivaAcumulado = 0;
        productos.forEach(p => {
            if (p.valorTotal > 0) {
                subtotal += p.valorTotal;
                ivaAcumulado += p.valorTotal * (p.iva / 100);
            }
        });
        setTotalVenta(Math.round(subtotal));
        setTotalIva(Math.round(ivaAcumulado));
        setTotalConIva(Math.round(subtotal + ivaAcumulado));
    }, [productos]);

    const consultarCliente = async () => {
        if (!cedulaCliente) return;
        try {
            const respuesta = await buscarCliente(cedulaCliente);
            if (respuesta.data && respuesta.data.nombreCliente) {
                setNombreCliente(respuesta.data.nombreCliente);
            } else {
                alert("Cliente no encontrado.");
                setNombreCliente("");
            }
        } catch (error) { alert("Error al buscar cliente."); }
    };

    const consultarProducto = async (index, codigo) => {
        if (!codigo) return;
        try {
            const respuesta = await buscarProducto(codigo);
            if (respuesta.data) {
                const nuevosProductos = [...productos];
                nuevosProductos[index].nombre = respuesta.data.nombre_producto || respuesta.data.nombreProducto;
                nuevosProductos[index].precio = respuesta.data.precio_venta || respuesta.data.precioVenta;
                nuevosProductos[index].iva = respuesta.data.ivacompra ?? respuesta.data.ivaCompra ?? 0;
                if (nuevosProductos[index].cantidad > 0) {
                    nuevosProductos[index].valorTotal = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
                }
                setProductos(nuevosProductos);
            }
        } catch (error) { alert("Producto no encontrado."); }
    };

    const manejarCantidad = (index, cantidad) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].cantidad = cantidad;
        nuevosProductos[index].valorTotal = (parseInt(cantidad) || 0) * nuevosProductos[index].precio;
        setProductos(nuevosProductos);
    };

    const confirmarVenta = async () => {
        const cajero = localStorage.getItem("cedulaUsuario");
        if (!cajero || !nombreCliente) { alert("Verifique cajero y cliente"); return; }
        try {
            const resVenta = await guardarVenta({
                codigo_venta: 0,
                cedula_cliente: parseInt(cedulaCliente),
                cedula_usuario: parseInt(cajero),
                ivaventa: totalIva,
                valor_venta: totalVenta,
                total_venta: totalConIva
            });
            const idVenta = resVenta.data.codigo_venta;
            for (let p of productos) {
                if (p.codigo && p.cantidad > 0) {
                    await guardarDetalleVenta({
                        codigo_detalle_venta: 0,
                        codigo_producto: parseInt(p.codigo),
                        codigo_venta: idVenta,
                        cantidad_producto: parseInt(p.cantidad),
                        valor_total: p.valorTotal,
                        valor_venta: p.precio,
                        valoriva: Math.round(p.valorTotal * (p.iva / 100))
                    });
                }
            }
            alert("Venta guardada con éxito");
            window.location.reload();
        } catch (error) { alert("Error al guardar"); }
    };

    return (
        <>
            <MenuPrincipal />
            <div className="main-content">
                <div className="table-card">
                    <div className="table-header"><h2>Nueva Venta</h2></div>
                    <div className="search-section">
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px', alignItems: 'end'}}>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Cédula Cliente</label>
                                <input type="number" style={{width: '100%'}} value={cedulaCliente} onChange={(e) => setCedulaCliente(e.target.value)} />
                            </div>
                            <button className="btn-crear" onClick={consultarCliente}>Validar</button>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Nombre del Cliente</label>
                                <input type="text" style={{width: '100%', background: '#eee'}} value={nombreCliente} readOnly />
                            </div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Código</th><th>Acción</th><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr>
                        </thead>
                        <tbody>
                            {productos.map((p, i) => (
                                <tr key={i}>
                                    <td><input type="number" value={p.codigo} onChange={(e) => {
                                        const n = [...productos]; n[i].codigo = e.target.value; setProductos(n);
                                    }} /></td>
                                    <td><button className="btn-crear" style={{padding: '5px 15px'}} onClick={() => consultarProducto(i, p.codigo)}>🔍</button></td>
                                    <td><input type="text" value={p.nombre} readOnly style={{background: '#f9f9f9', border: 'none'}} /></td>
                                    <td><input type="number" value={p.cantidad} onChange={(e) => manejarCantidad(i, e.target.value)} /></td>
                                    <td style={{fontWeight: 'bold'}}>${p.valorTotal.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '30px', alignItems: 'center'}}>
                        <button className="btn-crear" style={{padding: '15px 40px', fontSize: '18px'}} onClick={confirmarVenta}>Finalizar Compra</button>
                        <div className="total-box">
                            <p>Subtotal: <strong>${totalVenta.toLocaleString()}</strong></p>
                            <p>IVA (19%): <strong>${totalIva.toLocaleString()}</strong></p>
                            <hr style={{borderColor: '#444'}} />
                            <h3 style={{margin: 0}}>TOTAL: ${totalConIva.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ventas;