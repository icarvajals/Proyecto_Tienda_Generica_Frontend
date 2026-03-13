import "./reportes.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useState } from "react";
import { listarClientes } from "../Services/clienteService";
import axios from "axios";

function Reportes() {
    const [tipoReporte, setTipoReporte] = useState("");
    const [datos, setDatos] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [detalleFactura, setDetalleFactura] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);

    const cargarClientes = async () => {
        setTipoReporte("clientes");
        setDetalleFactura(null);
        setSeleccionados([]);
        try {
            const res = await listarClientes();
            const lista = res.data || [];
            setDatos(lista);
            const mapa = {};
            lista.forEach(c => { if(c.cedulaCliente) mapa[c.cedulaCliente] = c.nombreCliente; });
            setClientesMap(mapa);
        } catch (e) { setDatos([]); }
    };

    const cargarVentas = async () => {
        setTipoReporte("listado_ventas");
        setDetalleFactura(null);
        setSeleccionados([]);
        try {
            const resCli = await listarClientes();
            const mapa = {};
            (resCli.data || []).forEach(c => { mapa[c.cedulaCliente] = c.nombreCliente; });
            setClientesMap(mapa);

            const res = await axios.get("http://localhost:8081/api/ventas/listar");
            setDatos(res.data || []);
        } catch (e) { setDatos([]); }
    };

    const verDetalleIndividual = async (idVenta) => {
        try {
            const res = await axios.get(`http://localhost:8081/api/ventas/detalle/${idVenta}`);
            setDetalleFactura({ id: idVenta, items: res.data || [] });
        } catch (e) { alert("Error al cargar detalle"); }
    };

    // Lógica de Checkboxes
    const handleSeleccionarTodos = (e) => {
        if (e.target.checked) {
            const todos = datos.map(v => v.codigo_venta || v.cedulaCliente);
            setSeleccionados(todos);
        } else {
            setSeleccionados([]);
        }
    };

    const handleCheck = (id) => {
        setSeleccionados(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // REPORTE MAESTRO FILTRADO
    const generarReporteSeleccionado = async () => {
        if (seleccionados.length === 0) return alert("Por favor, selecciona al menos un registro para exportar.");
        
        const ventana = window.open('', '_blank', 'height=800,width=1000');
        ventana.document.write(`
            <html><head><title>Reporte de Gestión</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
                .report-header { text-align: center; border-bottom: 3px solid #4338ca; margin-bottom: 30px; padding-bottom: 10px; }
                .venta-box { border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 25px; border-radius: 8px; page-break-inside: avoid; }
                .v-head { background: #f1f5f9; padding: 10px; display: flex; justify-content: space-between; font-weight: bold; border-radius: 4px; border-bottom: 1px solid #cbd5e1; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
                th { background: #f8fafc; }
                .total-line { text-align: right; font-weight: bold; background: #f8fafc; }
            </style></head><body>
            <div class="report-header">
                <h1>TIENDA GENÉRICA S.A.S</h1>
                <p>REPORTE DETALLADO DE OPERACIONES</p>
                <small>Fecha: ${new Date().toLocaleString()}</small>
            </div>
        `);

        const datosFiltrados = datos.filter(d => seleccionados.includes(d.codigo_venta || d.cedulaCliente));

        if (tipoReporte === "clientes") {
            ventana.document.write('<h3>Listado de Clientes Seleccionados</h3><table><thead><tr><th>Cédula</th><th>Nombre</th><th>Email</th></tr></thead><tbody>');
            datosFiltrados.forEach(c => {
                ventana.document.write(`<tr><td>${c.cedulaCliente}</td><td>${c.nombreCliente}</td><td>${c.emailCliente}</td></tr>`);
            });
            ventana.document.write('</tbody></table>');
        } else {
            for (let v of datosFiltrados) {
                try {
                    const res = await axios.get(`http://localhost:8081/api/ventas/detalle/${v.codigo_venta}`);
                    const items = res.data || [];
                    const nombreCli = clientesMap[v.cedula_cliente] || "No registrado";
                    ventana.document.write(`
                        <div class="venta-box">
                            <div class="v-head">
                                <span>Factura #: ${v.codigo_venta}</span>
                                <span>Cliente: ${nombreCli} (${v.cedula_cliente})</span>
                            </div>
                            <table>
                                <thead><tr><th>Producto</th><th>Cant.</th><th>Precio Un.</th><th>Subtotal</th></tr></thead>
                                <tbody>
                                    ${items.map(it => `<tr><td>${it[0]}</td><td>${it[1]}</td><td>$${it[2].toLocaleString()}</td><td>$${it[3].toLocaleString()}</td></tr>`).join('')}
                                    <tr class="total-line"><td colspan="3">TOTAL VENTA:</td><td>$${v.total_venta.toLocaleString()}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    `);
                } catch (e) { console.error(e); }
            }
        }
        ventana.document.write('</body></html>');
        ventana.document.close();
        setTimeout(() => ventana.print(), 1000);
    };

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Módulo de Reportes</h2>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                            <button className="btn-crear" onClick={cargarClientes}>Cargar Clientes</button>
                            <button className="btn-crear" style={{background: '#2ecc71'}} onClick={cargarVentas}>Cargar Ventas</button>
                            
                            {/* Botón con nombre normal que no cambia */}
                            {datos.length > 0 && (
                                <button className="btn-crear" style={{background: '#4338ca'}} onClick={generarReporteSeleccionado}>
                                    Exportar PDF 📄
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="table">
                        {datos.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{width: '40px'}}>
                                            <input type="checkbox" onChange={handleSeleccionarTodos} 
                                            checked={seleccionados.length === datos.length} />
                                        </th>
                                        {tipoReporte === "clientes" ? 
                                            <><th>Cédula</th><th>Nombre</th><th>Email</th></> :
                                            <><th>Venta #</th><th>Nombre Cliente</th><th>Total</th><th>Acción</th></>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.map((d, i) => {
                                        const id = d.codigo_venta || d.cedulaCliente;
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <input type="checkbox" checked={seleccionados.includes(id)} 
                                                    onChange={() => handleCheck(id)} />
                                                </td>
                                                {tipoReporte === "clientes" ? (
                                                    <><td>{d.cedulaCliente}</td><td>{d.nombreCliente}</td><td>{d.emailCliente}</td></>
                                                ) : (
                                                    <>
                                                        <td>{d.codigo_venta}</td>
                                                        <td style={{fontWeight: '500'}}>{clientesMap[d.cedula_cliente] || "Cargando..."}</td>
                                                        <td>${(d.total_venta || 0).toLocaleString()}</td>
                                                        <td>
                                                            <button className="btn-crear" style={{padding: '4px 8px', fontSize: '11px', background: '#f39c12'}} 
                                                            onClick={() => verDetalleIndividual(d.codigo_venta)}>Ver Detalle</button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                        
                        {detalleFactura && (
                            <div className="detalle-impresion" style={{marginTop: '30px', padding: '20px', border: '2px solid #4338ca', borderRadius: '12px', background: '#fff'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <h3 style={{margin: 0}}>Desglose en Pantalla: Factura #{detalleFactura.id}</h3>
                                    <button onClick={() => setDetalleFactura(null)} style={{background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer'}}>Cerrar</button>
                                </div>
                                <table>
                                    <thead><tr><th>Producto</th><th>Cant.</th><th>Precio Un.</th><th>Subtotal</th></tr></thead>
                                    <tbody>
                                        {detalleFactura.items.map((it, i) => (
                                            <tr key={i}>
                                                <td>{it[0]}</td><td>{it[1]}</td><td>${it[2].toLocaleString()}</td><td>${it[3].toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default Reportes;