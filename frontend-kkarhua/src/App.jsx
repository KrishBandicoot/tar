import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import { Home } from './pages/Home/Home';
import { HomeAdmin } from './pages/AdminHome/HomeAdmin';
import { Contacto } from './pages/Contacto/Contacto';
import { ListaProductos } from './pages/ListaProductos/ListaProductos';
import { DetalleProducto } from './pages/DetalleProducto/DetalleProducto';
import { Carrito } from './pages/Carrito/Carrito';
import { IniciarSesion } from './pages/IniciarSesion/IniciarSesion';
import { Registrar } from './pages/Registrar/Registrar';
import { CrearProducto } from './componentes/CrearProd/CrearProducto';
import { EditarProd } from './componentes/EditarProd/EditarProd';
import { Productos } from './componentes/Productos/Productos';
import './App.css'  

function App() {
  
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/lista-productos" element={<ListaProductos />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              
              {/* Rutas de autenticación */}
              <Route path="/IniciarSesion" element={<IniciarSesion />} />
              <Route path="/Registrar" element={<Registrar />} />
              
              {/* Rutas de administración */}
              <Route path="/crear-producto" element={<CrearProducto />} /> 
              <Route path="/editar-producto/:id" element={<EditarProd />} />
           </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App