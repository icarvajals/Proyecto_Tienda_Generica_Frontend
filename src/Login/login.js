import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"; 

function Login() {
    const [cedula, setCedula] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();

        if (!cedula || !password) {
            alert("Por favor, ingresa tu cédula y contraseña.");
            return;
        }

        try {
            const respuesta = await axios.get(`http://localhost:8081/usuarios/buscar/${cedula}`);
            
            if (respuesta.data && respuesta.data.password === password) {
                localStorage.setItem("cedulaUsuario", respuesta.data.cedulaUsuario);
                localStorage.setItem("nombreUsuario", respuesta.data.nombreUsuario);
                
                navigate("/bienvenida");
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            alert("Usuario no encontrado o error de conexión con el servidor.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>🛒 Tienda Genérica</h2>
                <h3>Iniciar Sesión</h3>
                
                <form onSubmit={manejarLogin}>
                    <div className="input-group">
                        <label>Cédula de Usuario</label>
                        <input 
                            type="number" 
                            value={cedula} 
                            onChange={(e) => setCedula(e.target.value)} 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    
                    <button type="submit" className="btn-crear">
                        Ingresar al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;