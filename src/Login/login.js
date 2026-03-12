import "../Login/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();

    const[usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const iniciarSesion = async (e) => {
        e.preventDefault();

        const datos = {
            id: usuario,
            contraseña: password
        };

        try {
            const respuesta = await fetch("http://localhost:8081/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const texto = await respuesta.text();

            if (texto.includes("Login correcto")) {
                navigate("/bienvenida");
            } else {
                setError(texto);
            }

        } catch (error) {
            setError("Error conectando con el servidor");
        }
    };

    return (
        <div className="login-card">
            <h2>Tienda Genérica</h2>

            {error && (
            <div id="mensaje-error" className="error-message">
                {error}
            </div>
            )}

            <form id="loginForm" onSubmit={iniciarSesion}>
                <div className="input-group">
                    <label for="usuario">Usuario</label>
                    <input type="text" id="usuario" placeholder="Ingresa tu usuario"
                    value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div class="button-group">
                    <button type="submit" className="btn-primary">Aceptar</button>
                    <button type="button" className="btn-secondary" id="btnCancelar" onClick={() => {
                            setUsuario("");
                            setPassword("");
                        }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default Login;