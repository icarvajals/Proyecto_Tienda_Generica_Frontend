import './App.css';
import Login from './Login/login';
import Bienvenida from './Bienvenida/bienvenida';
import Clientes from './Cliente/clientes';
import Proveedores from './Proveedor/Proveedores';
import Productos from './Productos/productos';
import Ventas from './Ventas/ventas';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/bienvenida' element={<Bienvenida />} />
        <Route path='/clientes' element={<Clientes />} />
        <Route path='/proveedores' element={<Proveedores />} />
         <Route path="/productos" element={< Productos/>} />
         <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;