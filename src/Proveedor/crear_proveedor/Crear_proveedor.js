import { useState, useEffect } from "react";
import { guardarProveedor, actualizarProveedor } from "../../Services/proveedorService";
import "../proveedores.css"; // Usa la misma ruta de estilos que en tu archivo original

function ProveedorModal({ cerrarModal, actualizarTabla, proveedorAEditar }) {

    // El estado debe coincidir 100% con ProveedorDTO.java
    const [proveedor, setProveedor] = useState({
        nitProveedor: "",
        nombreProveedor: "",
        direccionProveedor: "",
        telefonoProveedor: "",
        ciudadProveedor: ""
    });

    // Si le damos clic a "Editar", prellenamos el formulario
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

    const manejarGuardado = () => {
        // 1. Validación de campos nulos para que no explote en Java
        if (!proveedor.nitProveedor || !proveedor.nombreProveedor || !proveedor.direccionProveedor || !proveedor.telefonoProveedor || !proveedor.ciudadProveedor) {
            alert("Por favor, llena todos los campos del proveedor.");
            return;
        }

        // 2. CONVERSIÓN CRÍTICA: El NIT debe ser Number para que Java lo acepte como Long
        const dataParaEnviar = {
            ...proveedor,
            nitProveedor: Number(proveedor.nitProveedor)
        };

        // 3. Ejecutamos la petición al backend
        const peticion = proveedorAEditar 
            ? actualizarProveedor(dataParaEnviar) 
            : guardarProveedor(dataParaEnviar);

        peticion
            .then(() => {
                alert(proveedorAEditar ? "Proveedor actualizado con éxito" : "Proveedor guardado en Base de Datos");
                actualizarTabla(); // Recarga la lista desde la BD
                cerrarModal();
            })
            .catch(error => {
                console.error("Error al guardar:", error);
                alert("Error: " + (error.response?.data?.message || error.response?.data || "No se pudo conectar a la BD"));
            });
    };

    return (
        <div className="modal-overlay active" id="proveedorModal">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{proveedorAEditar ? "Editar Proveedor" : "Nuevo Proveedor"}</h3>
                    <button className="btn-close" onClick={cerrarModal}>&times;</button>
                </div>

                <form id="proveedorForm" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>NIT del Proveedor</label>
                            <input
                                type="number"
                                name="nitProveedor"
                                value={proveedor.nitProveedor}
                                onChange={handleChange}
                                placeholder="Ej: 900123456"
                                disabled={!!proveedorAEditar} // El ID no se puede editar
                            />
                        </div>

                        <div className="input-group">
                            <label>Nombre / Razón Social</label>
                            <input
                                type="text"
                                name="nombreProveedor"
                                value={proveedor.nombreProveedor}
                                onChange={handleChange}
                                placeholder="Ej: Distribuidora XYZ"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccionProveedor"
                            value={proveedor.direccionProveedor}
                            onChange={handleChange}
                            placeholder="Ej: Calle 10 # 20-30"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefonoProveedor"
                                value={proveedor.telefonoProveedor}
                                onChange={handleChange}
                                placeholder="Ej: 3009876543"
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

                    <div className="modal-footer">
                        <button type="button" className="btn-save" onClick={manejarGuardado}>
                            {proveedorAEditar ? "Actualizar" : "Guardar en BD"}
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