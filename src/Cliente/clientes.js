import "../Cliente/clientes.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarClientes, eliminarCliente } from "../Services/clienteService";
import ClienteModal from "./CrearCliente/crear_cliente";

function Clientes() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = () => {
        listarClientes()
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.error("Error cargando clientes", error);
            });
    };

    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = () => {
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [clienteAEliminar, setClienteAEliminar] = useState(null);

    const abrirConfirmacion = (id) => {
        setClienteAEliminar(id);
        setMostrarConfirm(true);
    };

    const cerrarModalConfirm = () => {
        setMostrarConfirm(false);
        setClienteAEliminar(null);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarCliente(clienteAEliminar);

            setClientes(clientes.filter(c => c.cedulaCliente !== clienteAEliminar));
            cerrarModalConfirm();

        } catch (error) {
            console.error("Error eliminando cliente", error);
        }

    };
    return (
        <><MenuPrincipal></MenuPrincipal>

            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Clientes</h2>
                        <div className="table-actions">
                            <input type="text" id="searchInput" className="search-bar" placeholder="Buscar por documento, nombre o correo..." />
                            <button className="btn-crear" onClick={abrirModal}> Nuevo Cliente</button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Correo Electrónico</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaClientes">
                                {clientes.map((cliente) => (

                                    <tr key={cliente.cedulaCliente}>
                                        <td>{cliente.cedulaCliente}</td>
                                        <td>{cliente.nombreCliente}</td>
                                        <td>{cliente.direccionCliente}</td>
                                        <td>{cliente.telefonoCliente}</td>
                                        <td>{cliente.emailCliente}</td>

                                        <td className="row-actions">
                                            <button
                                                className="btn-icon btn-edit"
                                                title="Editar cliente"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="btn-icon btn-delete"
                                                title="Eliminar cliente"
                                                onClick={() => abrirConfirmacion(cliente.cedulaCliente)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>


            {mostrarConfirm && (
                <div className="modal-overlay active">
                    <div className="modal-card confirm-card">
                        <div className="confirm-icon">⚠️</div>
                        <h3>¿Estás seguro?</h3>
                        <p>¿Seguro que quieres eliminar el cliente?</p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={cerrarModalConfirm}>
                                No, cancelar
                            </button>
                            <button className="btn-confirm-delete" onClick={confirmarEliminar}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {mostrarModal && (
                <ClienteModal
                    cerrarModal={cerrarModal}
                    actualizarTabla={cargarClientes}
                />
            )}
        </>
    );
}

export default Clientes;