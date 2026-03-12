import { useState, useEffect } from "react";
import { guardarProducto, actualizarProducto } from "../../Services/productoService";
import "./crear_producto.css";

function ProductoModal({ cerrarModal, actualizarTabla, productoAEditar }) {

    const [producto, setProducto] = useState({
        codigoProducto: "",
        nombreProducto: "",
        nitProveedor: "",
        precioCompra: "",
        precioVenta: ""
    });

    useEffect(() => {
        if (productoAEditar) {
            setProducto(productoAEditar);
        }
    }, [productoAEditar]);

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const guardar = () => {
        // Convertimos a número antes de enviar si es necesario
        const datosAEnviar = {
            ...producto,
            codigoProducto: parseInt(producto.codigoProducto),
            nitProveedor: parseInt(producto.nitProveedor),
            precioCompra: parseFloat(producto.precioCompra),
            precioVenta: parseFloat(producto.precioVenta)
        };

        const accion = productoAEditar ? actualizarProducto(datosAEnviar) : guardarProducto(datosAEnviar);
        
        accion.then(() => {
            alert(productoAEditar ? "Producto actualizado" : "Producto guardado");
            actualizarTabla();
            cerrarModal();
        })
        .catch(error => {
            console.error(error);
            alert("Error al procesar el producto");
        });
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{productoAEditar ? "Editar Producto" : "Nuevo Producto"}</h3>
                    <button className="btn-close" onClick={cerrarModal}>&times;</button>
                </div>

                <form>
                    <div className="form-row">
                        <div className="input-group">
                            <label>Código Producto</label>
                            <input
                                type="number"
                                name="codigoProducto"
                                value={producto.codigoProducto}
                                onChange={handleChange}
                                disabled={!!productoAEditar}
                                placeholder="Ej: 101"
                            />
                        </div>
                        <div className="input-group">
                            <label>NIT Proveedor</label>
                            <input
                                type="number"
                                name="nitProveedor"
                                value={producto.nitProveedor}
                                onChange={handleChange}
                                placeholder="NIT del proveedor"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Nombre del Producto</label>
                        <input
                            type="text"
                            name="nombreProducto"
                            value={producto.nombreProducto}
                            onChange={handleChange}
                            placeholder="Ej: Arroz 1kg"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Precio Compra</label>
                            <input
                                type="number"
                                name="precioCompra"
                                value={producto.precioCompra}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="input-group">
                            <label>Precio Venta</label>
                            <input
                                type="number"
                                name="precioVenta"
                                value={producto.precioVenta}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-save" onClick={guardar}>
                            {productoAEditar ? "Actualizar" : "Guardar"}
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

export default ProductoModal;