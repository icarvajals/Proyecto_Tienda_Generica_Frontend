import React, { useState, useEffect } from "react";
import MenuPrincipal from "../Menu/menuPrincipal";
import "../Cliente/clientes.css"; 
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
        } catch (error) {
            alert("Error al buscar el cliente.");
        }
    };

    const consultarProducto = async (index, codigo) => {
        if (!codigo) return;
        try {
            const respuesta = await buscarProducto(codigo);
            if (respuesta.data) {
                const nuevosProductos = [...productos];
                nuevosProductos[index].nombre = respuesta.data.nombre_producto;
                nuevosProductos[index].precio = respuesta.data.precio_venta;
                nuevosProductos[index].iva = respuesta.data.ivacompra; 
                const cant = nuevosProductos[index].cantidad;
                if (cant > 0) {
                    nuevosProductos[index].valorTotal = cant * respuesta.data.precio_venta;
                }
                setProductos(nuevosProductos);
            } else {
                alert("Producto no encontrado.");
            }
        } catch (error) {
            alert("Error al buscar el producto.");
        }
    };

    const manejarCantidad = (index, cantidad) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].cantidad = cantidad;
        const cantNum = parseInt(cantidad) || 0;
        nuevosProductos[index].valorTotal = cantNum * nuevosProductos[index].precio;
        setProductos(nuevosProductos);
    };

    const confirmarVenta = async () => {
        if (!nombreCliente) {
            alert("Consulta un cliente primero.");
            return;
        }

        try {
            // PASO A: Guardar Venta
            const nuevaVenta = {
                codigo_venta: 0,
                cedula_cliente: parseInt(cedulaCliente),
                cedula_usuario: 0, 
                ivaventa: totalIva,
                valor_venta: totalVenta,
                total_venta: totalConIva
            };
            
            console.log("Enviando Venta:", nuevaVenta);
            const resVenta = await guardarVenta(nuevaVenta);
            
            // CAPTURA DEL ID CORREGIDA: Según tu DTO es codigo_venta
            const codigoVentaGenerado = resVenta.data.codigo_venta; 
            console.log("ID de Venta generado por DB:", codigoVentaGenerado);

            // PASO B: Guardar Detalles (Nombres exactos de tu DetalleVentaDTO)
            let detallesGuardados = 0;
            for (let i = 0; i < productos.length; i++) {
                const p = productos[i];
                if (p.codigo && p.cantidad > 0) {
                    const nuevoDetalle = {
                        codigo_detalle_venta: 0,
                        codigo_producto: parseInt(p.codigo),
                        codigo_venta: codigoVentaGenerado, // El ID que nos dio el paso anterior
                        cantidad_producto: parseInt(p.cantidad),
                        valor_total: Math.round(p.valorTotal),
                        valor_venta: Math.round(p.precio),
                        valoriva: Math.round(p.valorTotal * (p.iva / 100))
                    };
                    console.log(`Enviando Detalle ${i+1}:`, nuevoDetalle);
                    await guardarDetalleVenta(nuevoDetalle);
                    detallesGuardados++;
                }
            }

            alert(`¡Venta #${codigoVentaGenerado} registrada con éxito!`);
            window.location.reload(); 

        } catch (error) {
            console.error("Detalle del error:", error.response ? error.response.data : error.message);
            alert("Error al guardar. Revisa que el servidor Java esté reportando éxito.");
        }
    };

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card" style={{ padding: '20px' }}>
                    <h2 style={{ textAlign: 'center' }}>Módulo de Ventas</h2>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end' }}>
                        <div>
                            <label>Cédula Cliente:</label>
                            <input type="number" className="search-bar" value={cedulaCliente} onChange={(e) => setCedulaCliente(e.target.value)} />
                        </div>
                        <button className="btn-crear" onClick={consultarCliente}>Consultar</button>
                        <div style={{ flex: 1 }}>
                            <label>Nombre Cliente:</label>
                            <input type="text" className="search-bar" value={nombreCliente} readOnly style={{ background: '#f5f5f5' }} />
                        </div>
                    </div>

                    <table style={{ width: '100%', marginBottom: '30px' }}>
                        <thead>
                            <tr>
                                <th>Cod. Producto</th>
                                <th>Buscar</th>
                                <th>Nombre Producto</th>
                                <th>Cant.</th>
                                <th>Vlr. Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p, index) => (
                                <tr key={index}>
                                    <td><input type="number" style={{ width: '100%', padding: '5px' }} value={p.codigo} onChange={(e) => {
                                        const n = [...productos]; n[index].codigo = e.target.value; setProductos(n);
                                    }}/></td>
                                    <td><button className="btn-icon" onClick={() => consultarProducto(index, p.codigo)}>🔍</button></td>
                                    <td><input type="text" style={{ width: '100%', padding: '5px', background: '#f5f5f5' }} value={p.nombre} readOnly /></td>
                                    <td><input type="number" style={{ width: '80px', padding: '5px' }} value={p.cantidad} onChange={(e) => manejarCantidad(index, e.target.value)}/></td>
                                    <td><input type="text" style={{ width: '120px', padding: '5px', background: '#f5f5f5' }} value={`$${p.valorTotal}`} readOnly /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn-crear" onClick={confirmarVenta}>✅ Confirmar Venta</button>
                        <div style={{ width: '250px', background: '#f8f9fa', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' }}>
                            <div>Total Venta: ${totalVenta}</div>
                            <div>Total IVA: ${totalIva}</div>
                            <hr />
                            <strong>Total con IVA: ${totalConIva}</strong>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Ventas;