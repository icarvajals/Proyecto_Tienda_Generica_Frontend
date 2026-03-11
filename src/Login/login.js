import "../Login/login.css";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const validarLogin = (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;

        if (usuario === "admin" && password === "123") {
            navigate("/bienvenida");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }

    return (
        <div className="login-card">
            <h2>Tienda Genérica</h2>

            <div id="mensaje-error" className="error-message">
                Usuario o contraseña incorrectos.
            </div>

            <form id="loginForm" onSubmit={validarLogin}>
                <div className="input-group">
                    <label for="usuario">Usuario</label>
                    <input type="text" id="usuario" placeholder="Ingresa tu usuario" required />
                </div>

                <div className="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" placeholder="••••••••" required />
                </div>

                <div class="button-group">
                    <button type="submit" className="btn-primary">Aceptar</button>
                    <button type="button" className="btn-secondary" id="btnCancelar">Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default Login;