import { useState, useEffect } from "react";
import { guardarUsuario, actualizarUsuario } from "../Services/usuarioService";
import "./usuario.css"; 

function UsuarioModal({ cerrarModal, actualizarTabla, usuarioAEditar }) {
    
    // Estado inicial mapeado exactamente a tu DTO de Java
    const [usuario, setUsuario] = useState({
        cedulaUsuario: "",
        nombreUsuario: "",
        direccionUsuario: "",
        emailUsuario: "",
        telefono: "", 
        password: ""
    });

    // Si le pasamos un usuario existente (Botón Editar), lo carga en el formulario
    useEffect(() => {
        if (usuarioAEditar) {
            setUsuario(usuarioAEditar);
        }
    }, [usuarioAEditar]);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const guardar = () => {
        // Validación para evitar el IllegalArgumentException de tu backend
        if (!usuario.cedulaUsuario || !usuario.nombreUsuario || !usuario.emailUsuario || !usuario.telefono || !usuario.password) {
            alert("Por favor, llena todos los campos obligatorios.");
            return;
        }

        // Convertimos la cédula a número (Long en Java)
        const dataParaEnviar = {
            ...usuario,
            cedulaUsuario: Number(usuario.cedulaUsuario)
        };

        // Si existe usuarioAEditar, actualizamos. Si no, guardamos uno nuevo.
        const peticion = usuarioAEditar 
            ? actualizarUsuario(dataParaEnviar) 
            : guardarUsuario(dataParaEnviar);

        peticion
            .then(() => {
                alert(usuarioAEditar ? "Usuario actualizado con éxito" : "Usuario guardado con éxito");
                actualizarTabla(); // Recarga la lista
                cerrarModal();     // Cierra la ventana emergente
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                alert("Error: " + (error.response?.data || "No se pudo comunicar con el servidor"));
            });
    };

    return (
        <div className="modal-overlay active" id="usuarioModal">
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="modalTitle">{usuarioAEditar ? "Editar Usuario" : "Nuevo Usuario"}</h3>
                    <button className="btn-close" onClick={cerrarModal}>&times;</button>
                </div>

                <form id="usuarioForm" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>Número de Cédula</label>
                            <input
                                type="number"
                                name="cedulaUsuario"
                                value={usuario.cedulaUsuario}
                                onChange={handleChange}
                                placeholder="Ej: 1001234567"
                                disabled={!!usuarioAEditar} // No se puede cambiar la cédula al editar
                            />
                        </div>

                        <div className="input-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={usuario.nombreUsuario}
                                onChange={handleChange}
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Dirección de Residencia</label>
                        <input
                            type="text"
                            name="direccionUsuario"
                            value={usuario.direccionUsuario}
                            onChange={handleChange}
                            placeholder="Ej: Calle 45 # 12-34"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Teléfono / Celular</label>
                            <input
                                type="text"
                                name="telefono"
                                value={usuario.telefono}
                                onChange={handleChange}
                                placeholder="3001234567"
                            />
                        </div>

                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="emailUsuario"
                                value={usuario.emailUsuario}
                                onChange={handleChange}
                                placeholder="usuario@tienda.com"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Contraseña de Acceso</label>
                        <input
                            type="password"
                            name="password"
                            value={usuario.password}
                            onChange={handleChange}
                            placeholder="********"
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-save"
                            onClick={guardar}
                        >
                            {usuarioAEditar ? "Actualizar" : "Guardar"}
                        </button>

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={cerrarModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsuarioModal;