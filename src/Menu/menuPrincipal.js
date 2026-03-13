import React, { useState } from "react";
import "./menu.css";
import { Link } from "react-router-dom";

function MenuPrincipal() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => setMenuAbierto(!menuAbierto);
    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <nav className="navbar">
            <div className="menu-icon" onClick={toggleMenu}>
                {menuAbierto ? "✖" : "☰"}
            </div>

            <Link to="/bienvenida" className="logo" onClick={cerrarMenu}>
                🛒 Tienda Genérica
            </Link>
            
            <ul className={`nav-links ${menuAbierto ? "active" : ""}`}>
                <li><Link to="/usuarios" onClick={cerrarMenu}>Usuarios</Link></li>
                <li><Link to="/clientes" onClick={cerrarMenu}>Clientes</Link></li>
                <li><Link to="/proveedores" onClick={cerrarMenu}>Proveedores</Link></li>
                <li><Link to="/productos" onClick={cerrarMenu}>Productos</Link></li>
                <li><Link to="/ventas" onClick={cerrarMenu}>Ventas</Link></li>
                <li><Link to="/reportes" onClick={cerrarMenu}>Reportes</Link></li>
                
                {/* Botón Salir dentro de la lista para móviles */}
                <li className="mobile-only">
                    <Link to="/" className="btn-logout-mobile" onClick={cerrarMenu}>Salir</Link>
                </li>
            </ul>

            {/* Botón Salir visible solo en escritorio */}
            <Link to="/" className="btn-logout desktop-only">Salir</Link>

            {menuAbierto && <div className="menu-overlay" onClick={cerrarMenu}></div>}
        </nav>
    );
}

export default MenuPrincipal;