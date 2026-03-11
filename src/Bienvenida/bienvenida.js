import "../Bienvenida/bienvenida.css";
import MenuPrincipal from "../Menu/menuPrincipal";

function Bienvenida() {
    return (
        <><MenuPrincipal></MenuPrincipal>
            <main className="main-content">
                <div className="welcome-card">
                    <h1>¡Bienvenido al Sistema!</h1>
                    <p>Has ingresado exitosamente como <strong>Administrador Inicial</strong>.</p>
                    <p className="parrafo">Utiliza el menú para navegar entre los diferentes módulos del sistema.</p>
                </div>
            </main>
        </>
    );
}

export default Bienvenida;