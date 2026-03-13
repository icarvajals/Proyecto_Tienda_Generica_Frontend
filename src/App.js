import './App.css'; /* Si tu App.css está vacío o solo importa index.css, déjalo */
import Login from './Login/login';
import Bienvenida from './Bienvenida/bienvenida';
import Clientes from './Cliente/clientes';
import Proveedores from './Proveedor/Proveedores';
import Productos from './Productos/productos';
import Ventas from './Ventas/ventas';
import Usuario from './Usuario/usuario';
import Reportes from './Reportes/reportes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/bienvenida' element={<Bienvenida />} />
        <Route path='/clientes' element={<Clientes />} />
        <Route path='/proveedores' element={<Proveedores />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;