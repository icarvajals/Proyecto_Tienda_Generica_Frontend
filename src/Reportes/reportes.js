import "./reportes.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { obtenerReporteClientes } from "../Services/reporteService";

function Reportes() {
    const [reporteClientes, setReporteClientes] = useState([]);
    const [totales, setTotales] = useState({ ventas: 0, iva: 0 });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        obtenerReporteClientes()
            .then((response) => {
                const data = response.data;
                setReporteClientes(data);
                
                // Calcular totales generales
                const sumVentas = data.reduce((acc, curr) => acc + curr.totalVenta, 0);
                const sumIva = sumVentas * 0.19;
                setTotales({ ventas: sumVentas, iva: sumIva });
            })
            .catch((error) => {
                console.error("Error cargando reporte", error);
            });
    };

    return (
        <>
            <MenuPrincipal />
            <main className="reportes-container">
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Ventas Acumuladas</h3>
                        <span className="value">${totales.ventas.toLocaleString()}</span>
                    </div>
                    <div className="stat-card iva">
                        <h3>Total IVA Recaudado (19%)</h3>
                        <span className="value">${totales.iva.toLocaleString()}</span>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-header">
                        <h2>Reporte de Ventas por Cliente</h2>
                        <div className="table-actions">
                            <button className="btn-crear" onClick={() => window.print()}>Imprimir Reporte</button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cédula Cliente</th>
                                    <th>Nombre Completo</th>
                                    <th>Valor Total Ventas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporteClientes.length > 0 ? (
                                    reporteClientes.map((item, index) => (
                                        <tr key={index}>
                                            <td><span className="doc-badge">{item.cedulaCliente}</span></td>
                                            <td>{item.nombreCliente}</td>
                                            <td style={{fontWeight: '600'}}>${item.totalVenta.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center'}}>No hay ventas registradas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Reportes;