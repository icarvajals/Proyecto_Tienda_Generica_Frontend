import { useState } from "react";
import { guardarCliente } from "../../Services/clienteService";
import "../CrearCliente/crear_cliente.css";

function ClienteModal({ cerrarModal, actualizarTabla }) {

    const [cliente, setCliente] = useState({
        cedulaCliente: "",
        nombreCliente: "",
        direccionCliente: "",
        telefonoCliente: "",
        emailCliente: ""
    });

    const handleChange = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value
        });
    };

    const guardar = () => {
        guardarCliente(cliente)
        .then(() => {
            alert("Cliente guardado");
            actualizarTabla();
            cerrarModal();
        })
        .catch(error => {
            console.error(error);
        });

    };

    return (

   <div className="modal-overlay active" id="clienteModal">
    <div className="modal-card">
        <div className="modal-header">
            <h3 id="modalTitle">Nuevo Cliente</h3>
            <button className="btn-close" onClick={cerrarModal}>&times;</button>
        </div>

        <form id="clienteForm">

            <div className="form-row">
                <div className="input-group">
                    <label>Tipo Doc.</label>
                    <select
                        id="modalTipoDoc"
                        name="tipoDocumento"
                        value={cliente.tipoDocumento}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione...</option>
                        <option value="CC">CC - Cédula</option>
                        <option value="CE">CE - Extranjería</option>
                        <option value="NIT">NIT - Empresa</option>
                        <option value="PAS">PAS - Pasaporte</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Número de Documento</label>
                    <input
                        type="text"
                        id="modalCedula"
                        name="cedulaCliente"
                        value={cliente.cedulaCliente}
                        onChange={handleChange}
                        placeholder="Ej: 1001234567"
                    />
                </div>
            </div>


            <div className="input-group">
                <label>Nombre Completo</label>
                <input
                    type="text"
                    id="modalNombre"
                    name="nombreCliente"
                    value={cliente.nombreCliente}
                    onChange={handleChange}
                    placeholder="Ej: Diana Martínez"
                />
            </div>


            <div className="input-group">
                <label>Dirección</label>
                <input
                    type="text"
                    id="modalDireccion"
                    name="direccionCliente"
                    value={cliente.direccionCliente}
                    onChange={handleChange}
                    placeholder="Ej: Calle 123 # 45 - 67"
                />
            </div>


            <div className="form-row">

                <div className="input-group">
                    <label>Teléfono Celular / Fijo</label>

                    <div className="phone-input-container">
                        <input
                            type="text"
                            id="modalTelefono"
                            name="telefonoCliente"
                            value={cliente.telefonoCliente}
                            onChange={handleChange}
                            placeholder="3001234567"
                        />
                    </div>
                </div>


                <div className="input-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="text"
                        id="modalCorreo"
                        name="emailCliente"
                        value={cliente.emailCliente}
                        onChange={handleChange}
                        placeholder="Ej: diana@correo.com"
                    />
                </div>

            </div>


            <div className="modal-footer">
                <button
                    type="button"
                    className="btn-save"
                    onClick={guardar}
                >
                    Guardar
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

export default ClienteModal;