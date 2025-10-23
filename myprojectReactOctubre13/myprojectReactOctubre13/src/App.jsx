import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Contacto } from './pages/Contacto/Contacto';
import { Inventario } from './pages/Inventario/inventario';
import { CrearProducto } from './componentes/CrearProd/CrearProducto';
import { EditarProd } from './componentes/EditarProd/EditarProd';
import './App.css'  
import { Productos } from './componentes/Productos/Productos';

function App() {
  

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/crear-producto" element={<CrearProducto />} /> 
          <Route path="/editar-producto/:id" element={<EditarProd />} />
       </Routes>
    </Router>
  )
}

export default App
