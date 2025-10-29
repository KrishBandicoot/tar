import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/register';
import Productos from './pages/productos';
import DetalleProducto from './pages/detalleProducto';
import Blog from './pages/Blog';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

// Pages de administración
import HomeAdmin from './pages/admin/HomeAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import AgregarUsuario from './pages/admin/AgregarUsuario';
import ModificarUsuario from './pages/admin/ModificarUsuario';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import AgregarProducto from './pages/admin/AgregarProducto';
import ModificarProducto from './pages/admin/ModificarProducto';

// Componente para rutas protegidas de administrador
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Componente para rutas protegidas (cualquier usuario autenticado)
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
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
            <AdminRoute>
              <HomeAdmin />
            </AdminRoute>
          } />
          
          <Route path="/admin/usuarios" element={
            <AdminRoute>
              <UsuariosAdmin />
            </AdminRoute>
          } />
          
          <Route path="/admin/usuarios/agregar" element={
            <AdminRoute>
              <AgregarUsuario />
            </AdminRoute>
          } />
          
          <Route path="/admin/usuarios/modificar/:id" element={
            <AdminRoute>
              <ModificarUsuario />
            </AdminRoute>
          } />
          
          <Route path="/admin/productos" element={
            <AdminRoute>
              <ProductosAdmin />
            </AdminRoute>
          } />
          
          <Route path="/admin/productos/agregar" element={
            <AdminRoute>
              <AgregarProducto />
            </AdminRoute>
          } />
          
          <Route path="/admin/productos/modificar/:id" element={
            <AdminRoute>
              <ModificarProducto />
            </AdminRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;