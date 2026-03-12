import "./ventas.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useState } from "react";
import { buscarCliente } from "../Services/clienteService";
import { buscarProducto } from "../Services/productoService";
import { guardarVenta } from "../Services/ventaService";

function Ventas() {
    const [cedula, setCedula] = useState("");
    const [clienteNombre, setClienteNombre] = useState("Cliente no seleccionado");
    const [carrito, setCarrito] = useState([]);
    const [prodTemp, setProdTemp] = useState({ codigo: "", nombre: "", precio: 0, cantidad: 1 });

    // Totales
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const consultarCliente = async () => {
        try {
            const res = await buscarCliente(cedula);
            setClienteNombre(res.data.nombreCliente);
        } catch (error) {
            alert("Cliente no encontrado");
            setClienteNombre("Cliente no seleccionado");
        }
    };

    const consultarProducto = async () => {
        try {
            const res = await buscarProducto(prodTemp.codigo);
            setProdTemp({ ...prodTemp, nombre: res.data.nombreProducto, precio: res.data.precioVenta });
        } catch (error) {
            alert("Producto no existe");
        }
    };

    const agregarAlCarrito = () => {
        if (!prodTemp.nombre) return;
        const nuevoItem = {
            codigo: prodTemp.codigo,
            nombre: prodTemp.nombre,
            precio: prodTemp.precio,
            cantidad: parseInt(prodTemp.cantidad),
            subtotal: prodTemp.precio * prodTemp.cantidad
        };
        setCarrito([...carrito, nuevoItem]);
        setProdTemp({ codigo: "", nombre: "", precio: 0, cantidad: 1 });
    };

    const procesarVenta = async () => {
        if (!cedula || carrito.length === 0) return alert("Faltan datos");

        const ventaData = {
            cedulaCliente: parseInt(cedula),
            detalleVenta: carrito.map(item => ({
                codigoProducto: parseInt(item.codigo),
                cantidadProducto: item.cantidad,
                valorVenta: item.precio,
                valorIva: item.precio * 0.19,
                valorTotal: item.subtotal * 1.19
            })),
            ivaventa: iva,
            totalVenta: total,
            valorVenta: subtotal
        };

        try {
            await guardarVenta(ventaData);
            alert("¡Venta Realizada con Éxito!");
            setCarrito([]);
            setCedula("");
            setClienteNombre("Cliente no seleccionado");
        } catch (error) {
            console.error(error);
            alert("Error al guardar la venta");
        }
    };

    return (
        <>
            <MenuPrincipal />
            <main className="ventas-container">
                <div className="venta-header-card">
                    <h2>Módulo de Ventas</h2>
                    <div className="info-row">
                        <div className="input-group">
                            <label>Cédula del Cliente</label>
                            <input type="number" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                        </div>
                        <button className="btn-crear" onClick={consultarCliente}>Validar Cliente</button>
                        <div className="input-group">
                            <label>Nombre Cliente</label>
                            <input type="text" value={clienteNombre} disabled />
                        </div>
                    </div>

                    <hr style={{border: "1px solid #f1f3f6", margin: "20px 0"}} />

                    <div className="info-row">
                        <div className="input-group">
                            <label>Cód. Producto</label>
                            <input type="number" value={prodTemp.codigo} onChange={(e) => setProdTemp({...prodTemp, codigo: e.target.value})} />
                        </div>
                        <button className="btn-crear" style={{background: "#667eea"}} onClick={consultarProducto}>Buscar</button>
                        <div className="input-group">
                            <label>Producto</label>
                            <input type="text" value={prodTemp.nombre} disabled />
                        </div>
                        <div className="input-group" style={{maxWidth: "100px"}}>
                            <label>Cant.</label>
                            <input type="number" value={prodTemp.cantidad} onChange={(e) => setProdTemp({...prodTemp, cantidad: e.target.value})} />
                        </div>
                        <button className="btn-crear" onClick={agregarAlCarrito}>+ Agregar</button>
                    </div>
                </div>

                <div className="table-card" style={{marginTop: "0"}}>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cód.</th>
                                    <th>Nombre Producto</th>
                                    <th>Cant.</th>
                                    <th>Precio Unit.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.codigo}</td>
                                        <td>{item.nombre}</td>
                                        <td>{item.cantidad}</td>
                                        <td>${item.precio}</td>
                                        <td>${item.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="resumen-footer">
                        <table className="totales-tabla">
                            <tbody>
                                <tr><td>Subtotal:</td><td>${subtotal.toFixed(2)}</td></tr>
                                <tr><td>IVA (19%):</td><td>${iva.toFixed(2)}</td></tr>
                                <tr className="total-highlight"><td>TOTAL:</td><td>${total.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <button className="btn-save" style={{marginTop: "20px", width: "100%", fontSize: "18px"}} onClick={procesarVenta}>
                        Finalizar Venta
                    </button>
                </div>
            </main>
        </>
    );
}

export default Ventas;