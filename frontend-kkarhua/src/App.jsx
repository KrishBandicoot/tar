import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Blog from './pages/Blog';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

// Pages de administración
import Dashboard from './pages/admin/Dashboard';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import AgregarUsuario from './pages/admin/AgregarUsuario';
import ModificarUsuario from './pages/admin/ModificarUsuario';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import AgregarProducto from './pages/admin/AgregarProducto';
import ModificarProducto from './pages/admin/ModificarProducto';

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas protegidas de administración */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute>
              <UsuariosAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios/agregar" element={
            <ProtectedRoute>
              <AgregarUsuario />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios/modificar/:id" element={
            <ProtectedRoute>
              <ModificarUsuario />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos" element={
            <ProtectedRoute>
              <ProductosAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos/agregar" element={
            <ProtectedRoute>
              <AgregarProducto />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos/modificar/:id" element={
            <ProtectedRoute>
              <ModificarProducto />
            </ProtectedRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;