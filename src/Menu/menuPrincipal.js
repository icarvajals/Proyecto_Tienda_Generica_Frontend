import "../Menu/menu.css";

function MenuPrincipal(){
    return (
    <nav className="navbar">
        <a href="menu.html" className="logo">🛒 Tienda Genérica</a>
        
        <button className="hamburger">
            <span></span><span></span><span></span>
        </button>

        <ul className="nav-links" id="navLinks">
            <li><a href="usuarios.html">Usuarios</a></li>
            <li><a href="clientes.html" className="active">Clientes</a></li>
            <li><a href="proveedores.html">Proveedores</a></li>
            <li><a href="productos.html">Productos</a></li>
            <li><a href="ventas.html">Ventas</a></li>
            <li><a href="reportes.html">Reportes</a></li>
        </ul>
        <a href="login.html" className="btn-logout">Salir</a>
    </nav>
    );
}

export default MenuPrincipal;