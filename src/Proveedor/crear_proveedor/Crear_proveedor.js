import { useState, useEffect } from "react";
import { guardarProveedor, actualizarProveedor } from "../../Services/proveedorService";
import "./crear_proveedor.css";

function ProveedorModal({ cerrarModal, actualizarTabla, proveedorAEditar }) {

    const [proveedor, setProveedor] = useState({
        nitProveedor: "",
        nombreProveedor: "",
        direccionProveedor: "",
        telefonoProveedor: "",
        ciudadProveedor: ""
    });

    useEffect(() => {
        if (proveedorAEditar) {
            setProveedor(proveedorAEditar);
        }
    }, [proveedorAEditar]);

    const handleChange = (e) => {
        setProveedor({
            ...proveedor,
            [e.target.name]: e.target.value
        });
    };

    const guardar = () => {
        const accion = proveedorAEditar ? actualizarProveedor(proveedor) : guardarProveedor(proveedor);
        
        accion.then(() => {
            alert(proveedorAEditar ? "Proveedor actualizado" : "Proveedor guardado");
            actualizarTabla();
            cerrarModal();
        })
        .catch(error => {
            console.error(error);
            alert("Error al procesar la solicitud");
        });
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{proveedorAEditar ? "Editar Proveedor" : "Nuevo Proveedor"}</h3>
                    <button className="btn-close" onClick={cerrarModal}>&times;</button>
                </div>

                <form>
                    <div className="form-row">
                        <div className="input-group">
                            <label>NIT Proveedor</label>
                            <input
                                type="number"
                                name="nitProveedor"
                                value={proveedor.nitProveedor}
                                onChange={handleChange}
                                disabled={!!proveedorAEditar}
                                placeholder="Ej: 800123456"
                            />
                        </div>
                        <div className="input-group">
                            <label>Ciudad</label>
                            <input
                                type="text"
                                name="ciudadProveedor"
                                value={proveedor.ciudadProveedor}
                                onChange={handleChange}
                                placeholder="Ej: Bogotá"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Nombre / Razón Social</label>
                        <input
                            type="text"
                            name="nombreProveedor"
                            value={proveedor.nombreProveedor}
                            onChange={handleChange}
                            placeholder="Ej: Distribuidora S.A.S"
                        />
                    </div>

                    <div className="input-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccionProveedor"
                            value={proveedor.direccionProveedor}
                            onChange={handleChange}
                            placeholder="Ej: Avenida Siempre Viva 123"
                        />
                    </div>

                    <div className="input-group">
                        <label>Teléfono de Contacto</label>
                        <input
                            type="text"
                            name="telefonoProveedor"
                            value={proveedor.telefonoProveedor}
                            onChange={handleChange}
                            placeholder="Ej: 6012345678"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-save" onClick={guardar}>
                            {proveedorAEditar ? "Actualizar" : "Guardar"}
                        </button>
                        <button type="button" className="btn-cancel" onClick={cerrarModal}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProveedorModal;