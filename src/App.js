import './App.css';
import Login from './Login/login';
import Bienvenida from './Bienvenida/bienvenida';
import Clientes from './Cliente/clientes';
import Proveedor from './Proveedor/Proveedor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/bienvenida' element={<Bienvenida />} />
        <Route path='/clientes' element={<Clientes />} />
        {/* EL MAPA AHORA SABE A DÓNDE IR */}
        <Route path='/proveedores' element={<Proveedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;