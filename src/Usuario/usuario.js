import "./usuario.css";
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarUsuarios, eliminarUsuario } from "../Services/usuarioService";
import UsuarioModal from "./UsuarioModal"; // Importamos el modal que creamos

function Usuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para el buscador
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        listarUsuarios()
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("Error cargando usuarios", error);
            });
    };

    const handleEliminar = (cedula) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            eliminarUsuario(cedula)
                .then(() => {
                    alert("Usuario eliminado correctamente");
                    cargarUsuarios();
                })
                .catch((error) => {
                    alert("Error al eliminar: " + (error.response?.data || "Cédula errada"));
                });
        }
    };

    const abrirModalEdicion = (u) => {
        setUsuarioSeleccionado(u);
        setModalAbierto(true);
    };

    const abrirModalNuevo = () => {
        setUsuarioSeleccionado(null);
        setModalAbierto(true);
    };

    // Lógica de filtrado para la barra de búsqueda
    const usuariosFiltrados = usuarios.filter((u) => {
        const termino = busqueda.toLowerCase();
        return (
            u.cedulaUsuario.toString().includes(termino) ||
            u.nombreUsuario.toLowerCase().includes(termino) ||
            u.emailUsuario.toLowerCase().includes(termino)
        );
    });

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Usuarios</h2>
                        <div className="table-actions">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Buscar por documento, nombre o correo..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button className="btn-crear" onClick={abrirModalNuevo}>
                                + Nuevo Usuario
                            </button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.map((u) => (
                                    <tr key={u.cedulaUsuario}>
                                        <td><span className="doc-badge">{u.cedulaUsuario}</span></td>
                                        <td>{u.nombreUsuario}</td>
                                        <td>{u.emailUsuario}</td>
                                        <td>{u.telefono}</td> {/* Usamos 'telefono' como en tu DTO */}
                                        <td className="row-actions">
                                            <button
                                                className="btn-icon btn-edit"
                                                title="Editar usuario"
                                                onClick={() => abrirModalEdicion(u)}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="btn-icon btn-delete"
                                                title="Eliminar usuario"
                                                onClick={() => handleEliminar(u.cedulaUsuario)}
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

            {/* Renderizado condicional del Modal */}
            {modalAbierto && (
                <UsuarioModal
                    cerrarModal={() => setModalAbierto(false)}
                    actualizarTabla={cargarUsuarios}
                    usuarioAEditar={usuarioSeleccionado}
                />
            )}
        </>
    );
}

export default Usuario;