import "./productos.css"; // Usa el mismo contenido de clientes.css
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState } from "react";
import { listarProductos, eliminarProducto, buscarProducto } from "../Services/productoService";
import ProductoModal from "./CrearProducto/crear_producto";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        listarProductos()
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error cargando productos", error));
    };

    const abrirModal = () => {
        setProductoAEditar(null);
        setMostrarModal(true);
    };

    const editarProducto = async (codigo) => {
        try {
            const response = await buscarProducto(codigo);
            setProductoAEditar(response.data);
            setMostrarModal(true);
        } catch (error) {
            alert("Producto no encontrado");
        }
    };

    const abrirConfirmacion = (id) => {
        setProductoAEliminar(id);
        setMostrarConfirm(true);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarProducto(productoAEliminar);
            setProductos(productos.filter(p => p.codigoProducto !== productoAEliminar));
            setMostrarConfirm(false);
        } catch (error) {
            console.error("Error eliminando producto", error);
        }
    };

    const productosFiltrados = productos.filter(p => 
        p.nombreProducto.toLowerCase().includes(filtro.toLowerCase()) ||
        p.codigoProducto.toString().includes(filtro)
    );

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Inventario (Productos)</h2>
                        <div className="table-actions">
                            <input 
                                type="text" 
                                className="search-bar" 
                                placeholder="Buscar por código o nombre..." 
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                            <button className="btn-crear" onClick={abrirModal}> Nuevo Producto</button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre Producto</th>
                                    <th>NIT Proveedor</th>
                                    <th>Precio Compra</th>
                                    <th>Precio Venta</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map((p) => (
                                    <tr key={p.codigoProducto}>
                                        <td><span className="doc-badge">{p.codigoProducto}</span></td>
                                        <td>{p.nombreProducto}</td>
                                        <td>{p.nitProveedor}</td>
                                        <td>${p.precioCompra}</td>
                                        <td>${p.precioVenta}</td>
                                        <td className="row-actions">
                                            <button className="btn-icon btn-edit" onClick={() => editarProducto(p.codigoProducto)}>✏️</button>
                                            <button className="btn-icon btn-delete" onClick={() => abrirConfirmacion(p.codigoProducto)}>🗑</button>
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
                        <h3>¿Eliminar Producto?</h3>
                        <p>¿Estás seguro de eliminar este producto del inventario?</p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setMostrarConfirm(false)}>Cancelar</button>
                            <button className="btn-confirm-delete" onClick={confirmarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModal && (
                <ProductoModal
                    cerrarModal={() => setMostrarModal(false)}
                    actualizarTabla={cargarProductos}
                    productoAEditar={productoAEditar}
                />
            )}
        </>
    );
}

export default Productos;