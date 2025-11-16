import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Contacto } from './pages/Contacto/Contacto';
import { ListaProductos } from './pages/ListaProductos/ListaProductos';
import { DetalleProducto } from './pages/DetalleProducto/DetalleProducto';
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
          <Route path="/lista-productos" element={<ListaProductos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/crear-producto" element={<CrearProducto />} /> 
          <Route path="/editar-producto/:id" element={<EditarProd />} />
       </Routes>
    </Router>
  )
}

export default App