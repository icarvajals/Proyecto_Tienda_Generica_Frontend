import "./clientes.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarClientes, eliminarCliente } from "../Services/clienteService";
import ClienteModal from "./ClienteModal"; 

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = () => {
        listarClientes()
            .then((response) => setClientes(response.data))
            .catch((error) => console.error("Error cargando clientes", error));
    };

    const handleEliminar = (cedula) => {
        if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
            eliminarCliente(cedula)
                .then(() => {
                    alert("Cliente eliminado");
                    cargarClientes();
                })
                .catch((error) => alert("Error: " + (error.response?.data || "No se pudo eliminar")));
        }
    };

    const abrirModalEdicion = (cliente) => {
        setClienteSeleccionado(cliente);
        setModalAbierto(true);
    };

    const abrirModalNuevo = () => {
        setClienteSeleccionado(null);
        setModalAbierto(true);
    };

    // Búsqueda en tiempo real
    const clientesFiltrados = clientes.filter((c) => {
        const termino = busqueda.toLowerCase();
        return (
            c.cedulaCliente.toString().includes(termino) ||
            c.nombreCliente.toLowerCase().includes(termino) ||
            c.emailCliente.toLowerCase().includes(termino)
        );
    });

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Clientes</h2>
                        <div className="table-actions">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Buscar por documento, nombre o correo..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button className="btn-crear" onClick={abrirModalNuevo}>
                                + Nuevo Cliente
                            </button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cédula</th>
                                    <th>Nombre Completo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.map((c) => (
                                    <tr key={c.cedulaCliente}>
                                        <td><span className="doc-badge">{c.cedulaCliente}</span></td>
                                        <td>{c.nombreCliente}</td>
                                        <td>{c.emailCliente}</td>
                                        <td>{c.telefonoCliente}</td>
                                        <td>{c.direccionCliente}</td>
                                        <td className="row-actions">
                                            <button className="btn-icon btn-edit" onClick={() => abrirModalEdicion(c)}>✏️</button>
                                            <button className="btn-icon btn-delete" onClick={() => handleEliminar(c.cedulaCliente)}>🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {modalAbierto && (
                <ClienteModal
                    cerrarModal={() => setModalAbierto(false)}
                    actualizarTabla={cargarClientes}
                    clienteAEditar={clienteSeleccionado}
                />
            )}
        </>
    );
}

export default Clientes;