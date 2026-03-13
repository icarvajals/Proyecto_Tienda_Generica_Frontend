import { useState, useEffect } from "react";
import { guardarCliente, actualizarCliente } from "../Services/clienteService";
import "./clientes.css"; // Ajusta esta ruta según donde tengas tu CSS

function ClienteModal({ cerrarModal, actualizarTabla, clienteAEditar }) {

    const [cliente, setCliente] = useState({
        cedulaCliente: "",
        nombreCliente: "",
        direccionCliente: "",
        emailCliente: "",
        telefonoCliente: ""
    });

    // Si recibimos un cliente (Botón Editar), prellenamos el formulario
    useEffect(() => {
        if (clienteAEditar) {
            setCliente(clienteAEditar);
        }
    }, [clienteAEditar]);

    const handleChange = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value
        });
    };

    const manejarGuardado = () => {
        // 1. Validación estricta para cumplir con el Backend
        if (!cliente.cedulaCliente || !cliente.nombreCliente || !cliente.direccionCliente || !cliente.emailCliente || !cliente.telefonoCliente) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // 2. Casteo de la cédula a Number para que coincida con el Long de Java
        const dataParaEnviar = {
            ...cliente,
            cedulaCliente: Number(cliente.cedulaCliente)
        };

        // 3. Decidir si guardar o actualizar
        const peticion = clienteAEditar 
            ? actualizarCliente(dataParaEnviar) 
            : guardarCliente(dataParaEnviar);

        peticion
            .then(() => {
                alert(clienteAEditar ? "Cliente actualizado con éxito" : "Cliente guardado con éxito");
                actualizarTabla();
                cerrarModal();
            })
            .catch(error => {
                console.error("Error en el cliente:", error);
                alert("Error: " + (error.response?.data || "Verifica la consola para más detalles"));
            });
    };

    return (
        <div className="modal-overlay active" id="clienteModal">
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="modalTitle">{clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}</h3>
                    <button className="btn-close" onClick={cerrarModal}>&times;</button>
                </div>

                <form id="clienteForm">
                    <div className="form-row">
                        <div className="input-group">
                            <label>Número de Documento</label>
                            <input
                                type="number"
                                name="cedulaCliente"
                                value={cliente.cedulaCliente}
                                onChange={handleChange}
                                placeholder="Ej: 1001234567"
                                disabled={!!clienteAEditar} // Bloqueamos la cédula si estamos editando
                            />
                        </div>

                        <div className="input-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="nombreCliente"
                                value={cliente.nombreCliente}
                                onChange={handleChange}
                                placeholder="Ej: Diana Martínez"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccionCliente"
                            value={cliente.direccionCliente}
                            onChange={handleChange}
                            placeholder="Ej: Calle 123 # 45 - 67"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Teléfono Celular / Fijo</label>
                            <input
                                type="text"
                                name="telefonoCliente"
                                value={cliente.telefonoCliente}
                                onChange={handleChange}
                                placeholder="3001234567"
                            />
                        </div>

                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="emailCliente"
                                value={cliente.emailCliente}
                                onChange={handleChange}
                                placeholder="Ej: diana@correo.com"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-save" onClick={manejarGuardado}>
                            {clienteAEditar ? "Actualizar" : "Guardar"}
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

export default ClienteModal;