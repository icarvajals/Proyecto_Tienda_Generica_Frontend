import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos las funciones de tu servicio en lugar de usar axios directamente aquí
import { buscarUsuario, loginUsuario } from "../Services/usuarioService"; 
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
            // 1. Enviamos los datos al backend usando la estructura que espera Java (LoginRequest)
            const credenciales = {
                id: parseInt(cedula), // Convertimos a número porque en Java tu ID es numérico
                contraseña: password
            };

            const respuestaLogin = await loginUsuario(credenciales);

            // 2. Validamos la respuesta exacta (String) que devuelve tu UsuarioController
            if (respuestaLogin.data === "Login correcto" || respuestaLogin.data === "Login correcto - admin inicial") {
                
                // 3. Guardamos datos en localStorage
                try {
                    // Intentamos traer los datos completos del usuario para el localStorage
                    const datosUsuario = await buscarUsuario(cedula);
                    localStorage.setItem("cedulaUsuario", datosUsuario.data.cedulaUsuario || cedula);
                    localStorage.setItem("nombreUsuario", datosUsuario.data.nombreUsuario || "Usuario");
                } catch (err) {
                    // Si es el admin inicial, puede que no esté en la base de datos aún, le damos valores por defecto
                    localStorage.setItem("cedulaUsuario", cedula);
                    localStorage.setItem("nombreUsuario", "Administrador");
                }
                
                // 4. Redirigimos a la bienvenida
                navigate("/bienvenida");

            } else {
                // Si Java responde "Usuario o contraseña incorrectos"
                alert(respuestaLogin.data); 
            }

        } catch (error) {
            console.error("Error en login:", error);
            alert("Error de conexión con el servidor. Verifica que ms-usuarios esté encendido.");
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