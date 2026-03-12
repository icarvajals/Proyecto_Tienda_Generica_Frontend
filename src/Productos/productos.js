import "../Cliente/clientes.css"; 
import MenuPrincipal from "../Menu/menuPrincipal";
import { useEffect, useState, useRef } from "react";
import { listarProductos, eliminarProducto, guardarProducto } from "../Services/productoService";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        listarProductos()
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error cargando productos", error));
    };

    const manejarCargaCSV = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = async (evento) => {
            const texto = evento.target.result;
            const lineas = texto.replace(/\r/g, '').split('\n').filter(linea => linea.trim() !== '');
            
            let errores = 0;
            let subidos = 0;
            let detalleError = "";

            // Empezamos desde i = 1 (omitiendo encabezados)
            for (let i = 1; i < lineas.length; i++) {
                const columnas = lineas[i].split(/,|;/);

                if (columnas.length >= 6) {
                    const nuevoProducto = {
    // Estos nombres deben ser IDÉNTICOS a los de tu ProductoDTO.java
                    codigo_producto: parseInt(columnas[0].trim()),
                    nombre_producto: columnas[1].trim(),
                    nitproveedor: parseInt(columnas[2].trim()),
                    precio_compra: parseInt(columnas[3].trim()),
                    ivacompra: parseInt(columnas[4].trim()),
                    precio_venta: parseInt(columnas[5].trim())
};

                    try {
                        await guardarProducto(nuevoProducto);
                        subidos++;
                    } catch (error) {
                        errores++;
                        // Capturamos el error para mostrártelo
                        if (errores === 1) {
                            detalleError = error.response 
                                ? `Código: ${error.response.status} - Mensaje: ${JSON.stringify(error.response.data)}`
                                : error.message;
                        }
                    }
                }
            }
            
            if (errores > 0) {
                alert(`Carga completada con advertencias:\n✅ Subidos: ${subidos}\n❌ Fallidos: ${errores}\n\nPrimer error detectado:\n${detalleError}`);
            } else {
                alert(`¡Éxito! Se cargaron ${subidos} productos correctamente.`);
            }

            cargarProductos(); 
            e.target.value = null; 
        };
        lector.readAsText(archivo);
    };

    const productosFiltrados = productos.filter((p) => {
        const termino = busqueda.toLowerCase();
        return (
            (p.codigo_producto && p.codigo_producto.toString().includes(termino)) ||
            (p.nombre_producto && p.nombre_producto.toLowerCase().includes(termino)) ||
            (p.nitproveedor && p.nitproveedor.toString().includes(termino))
        );
    });

    const abrirConfirmacion = (codigo) => {
        setProductoAEliminar(codigo);
        setMostrarConfirm(true);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarProducto(productoAEliminar);
            cargarProductos();
            setMostrarConfirm(false);
        } catch (error) {
            console.error("Error eliminando producto", error);
        }
    };

    return (
        <>
            <MenuPrincipal />
            <main className="main-content">
                <div className="table-card">
                    <div className="table-header">
                        <h2>Gestión de Productos (Carga Masiva)</h2>
                        <div className="table-actions">
                            <input 
                                type="text" 
                                className="search-bar" 
                                placeholder="Buscar por Código, Nombre o NIT..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                accept=".csv, .txt" 
                                style={{ display: 'none' }} 
                                onChange={manejarCargaCSV} 
                            />
                            <button 
                                className="btn-crear" 
                                style={{background: '#667eea'}} 
                                onClick={() => fileInputRef.current.click()}
                            >
                                📄 Cargar CSV
                            </button>
                        </div>
                    </div>

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>NIT Proveedor</th>
                                    <th>Precio Compra</th>
                                    <th>IVA (%)</th>
                                    <th>Precio Venta</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map((p) => (
                                    <tr key={p.codigo_producto}>
                                        <td><span className="doc-badge">{p.codigo_producto}</span></td>
                                        <td>{p.nombre_producto}</td>
                                        <td>{p.nitproveedor}</td>
                                        <td>${p.precio_compra}</td>
                                        <td>{p.ivacompra}%</td>
                                        <td><strong style={{color: '#2ecc71'}}>${p.precio_venta}</strong></td>
                                        <td className="row-actions">
                                            <button className="btn-icon btn-delete" title="Eliminar" onClick={() => abrirConfirmacion(p.codigo_producto)}>🗑</button>
                                        </td>
                                    </tr>
                                ))}
                                {productosFiltrados.length === 0 && (
                                    <tr><td colSpan="7" style={{textAlign: "center"}}>No hay productos en la base de datos</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {mostrarConfirm && (
                <div className="modal-overlay active">
                    <div className="modal-card confirm-card">
                        <div className="confirm-icon">⚠️</div>
                        <h3>¿Estás seguro?</h3>
                        <p>¿Seguro que quieres eliminar este producto?</p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setMostrarConfirm(false)}>No, cancelar</button>
                            <button className="btn-confirm-delete" onClick={confirmarEliminar}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Productos;