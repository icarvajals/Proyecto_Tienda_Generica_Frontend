import "./proveedores.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarProveedores, eliminarProveedor, buscarProveedor } from "../Services/proveedorService";
import ProveedorModal from "../Proveedor/crear_proveedor/Crear_proveedor";

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para el buscador
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
    const [proveedorAEditar, setProveedorAEditar] = useState(null);

    useEffect(() => {
        cargarProveedores();
    }, []);

  const cargarProveedores = () => {
        listarProveedores()
            .then((response) => {
                console.log("Datos recibidos de Java:", response.data); 
                
                if (Array.isArray(response.data)) {
                    setProveedores(response.data);
                } else if (response.data && response.data.content) {
                    setProveedores(response.data.content);
                } else {
                    setProveedores([]);
                }
            })
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
            alert("Error: No se pudo cargar la información del proveedor.");
        }
    };

    const abrirConfirmacion = (nit) => {
        setProveedorAEliminar(nit);
        setMostrarConfirm(true);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarProveedor(proveedorAEliminar);
            // Recargamos directamente desde la BD en lugar de solo filtrar el array local
            cargarProveedores();
            setMostrarConfirm(false);
            alert("Proveedor eliminado correctamente.");
        } catch (error) {
            console.error("Error eliminando proveedor", error);
            alert("No se pudo eliminar el proveedor. Verifica que no tenga productos asociados.");
            setMostrarConfirm(false);
        }
    };

    // Lógica para que funcione la barra de búsqueda
    const proveedoresFiltrados = proveedores.filter(p => {
        const termino = busqueda.toLowerCase();
        return (
            p.nitProveedor.toString().includes(termino) ||
            p.nombreProveedor.toLowerCase().includes(termino) ||
            p.ciudadProveedor.toLowerCase().includes(termino)
        );
    });

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Proveedores</h2>
                        <div className="table-actions">
                            <input 
                                type="text" 
                                className="search-bar" 
                                placeholder="Buscar por NIT, nombre o ciudad..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button className="btn-crear" onClick={abrirModal}> + Nuevo Proveedor</button>
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
                                {proveedoresFiltrados.map((p) => (
                                    <tr key={p.nitProveedor}>
                                        <td><span className="doc-badge">{p.nitProveedor}</span></td>
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

            {/* Modal de Confirmación de Borrado */}
            {mostrarConfirm && (
                <div className="modal-overlay active">
                    <div className="modal-card confirm-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div className="confirm-icon" style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
                        <h3>¿Eliminar Proveedor?</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Esta acción borrará el registro de la Base de Datos y no se puede deshacer.</p>
                        <div className="confirm-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="btn-cancel" onClick={() => setMostrarConfirm(false)}>Cancelar</button>
                            <button className="btn-delete" style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }} onClick={confirmarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Creación/Edición */}
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