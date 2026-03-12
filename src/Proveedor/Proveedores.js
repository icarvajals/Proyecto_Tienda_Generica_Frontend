import "./proveedores.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarProveedores, eliminarProveedor, buscarProveedor } from "../Services/proveedorService";
import ProveedorModal from "../Proveedor/crear_proveedor/Crear_proveedor";

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
    const [proveedorAEditar, setProveedorAEditar] = useState(null);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = () => {
        listarProveedores()
            .then((response) => setProveedores(response.data))
            .catch((error) => console.error("Error cargando proveedores", error));
    };

    const abrirModal = () => {
        setProveedorAEditar(null);
        setMostrarModal(true);
    };

    const editarProveedor = async (nit) => {
        try {
            const response = await buscarProveedor(nit);
            setProveedorAEditar(response.data);
            setMostrarModal(true);
        } catch (error) {
            alert("Proveedor no encontrado");
        }
    };

    const abrirConfirmacion = (id) => {
        setProveedorAEliminar(id);
        setMostrarConfirm(true);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarProveedor(proveedorAEliminar);
            setProveedores(proveedores.filter(p => p.nitProveedor !== proveedorAEliminar));
            setMostrarConfirm(false);
        } catch (error) {
            console.error("Error eliminando proveedor", error);
        }
    };

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Proveedores</h2>
                        <div className="table-actions">
                            <input type="text" className="search-bar" placeholder="Buscar proveedor..." />
                            <button className="btn-crear" onClick={abrirModal}> Nuevo Proveedor</button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>NIT</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Ciudad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proveedores.map((p) => (
                                    <tr key={p.nitProveedor}>
                                        <td>{p.nitProveedor}</td>
                                        <td>{p.nombreProveedor}</td>
                                        <td>{p.direccionProveedor}</td>
                                        <td>{p.telefonoProveedor}</td>
                                        <td>{p.ciudadProveedor}</td>
                                        <td className="row-actions">
                                            <button className="btn-icon btn-edit" onClick={() => editarProveedor(p.nitProveedor)}>✏️</button>
                                            <button className="btn-icon btn-delete" onClick={() => abrirConfirmacion(p.nitProveedor)}>🗑</button>
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
                        <h3>¿Eliminar Proveedor?</h3>
                        <p>Esta acción no se puede deshacer.</p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setMostrarConfirm(false)}>Cancelar</button>
                            <button className="btn-confirm-delete" onClick={confirmarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModal && (
                <ProveedorModal
                    cerrarModal={() => setMostrarModal(false)}
                    actualizarTabla={cargarProveedores}
                    proveedorAEditar={proveedorAEditar}
                />
            )}
        </>
    );
}

export default Proveedores;