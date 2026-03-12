import "../Menu/menu.css";
import { Link } from "react-router-dom";

function MenuPrincipal() {
    return (
        <nav className="navbar">
            <Link to="/bienvenida" className="logo">🛒 Tienda Genérica</Link>
            <ul className="nav-links" id="navLinks">
                <li><a href="usuarios">Usuarios</a></li>
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/proveedores">Proveedores</Link></li>
                <li><a href="productos">Productos</a></li>
                <li><a href="ventas">Ventas</a></li>
                <li><a href="reportes">Reportes</a></li>
            </ul>
            <a href="login.html" className="btn-logout">Salir</a>
        </nav>
    );
}

export default MenuPrincipal;