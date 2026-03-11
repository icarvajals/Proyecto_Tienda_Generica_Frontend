import './App.css';
import Login from './Login/login';
import Bienvenida from './Bienvenida/bienvenida';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/bienvenida' element={<Bienvenida />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
