import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { Footer } from '../../componentes/Footer/Footer';
import './HomeAdmin.css';

export function HomeAdmin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
      navigate('/');
      alert('Sesión cerrada exitosamente');
    }
  };

  const menuItems = [
    {
      title: 'Gestionar Productos',
      description: 'Ver, crear, editar y desactivar productos del inventario',
      icon: 'bi-box-seam',
      path: '/productos',
      color: '#0d6efd'
    },
    {
      title: 'Crear Producto',
      description: 'Agregar nuevos productos al catálogo',
      icon: 'bi-plus-circle',
      path: '/crear-producto',
      color: '#198754'
    },
    {
      title: 'Ver Tienda',
      description: 'Ver cómo se ve la tienda para los clientes',
      icon: 'bi-shop',
      path: '/lista-productos',
      color: '#6c757d'
    },
    {
      title: 'Ir al Inicio',
      description: 'Volver a la página principal',
      icon: 'bi-house',
      path: '/',
      color: '#fd7e14'
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>Panel de Administración</h1>
                <p className="text-muted mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  Bienvenido, <strong>{user?.nombre}</strong>
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-danger"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {menuItems.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div 
                  className="admin-card"
                  onClick={() => navigate(item.path)}
                  style={{ '--card-color': item.color }}
                >
                  <div className="admin-card-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3 className="admin-card-title">{item.title}</h3>
                  <p className="admin-card-description">{item.description}</p>
                  <div className="admin-card-arrow">
                    <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-section mt-5">
            <h2 className="text-center mb-4">Estadísticas Rápidas</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-primary">
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div className="stat-info">
                    <h4>Total Productos</h4>
                    <p className="stat-number">Ver en inventario</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-success">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="stat-info">
                    <h4>Productos Activos</h4>
                    <p className="stat-number">Ver detalles</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-warning">
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <div className="stat-info">
                    <h4>Productos Inactivos</h4>
                    <p className="stat-number">Ver detalles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-actions mt-5">
            <h2 className="text-center mb-4">Acciones Rápidas</h2>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/crear-producto')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Producto
              </button>
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/productos')}
              >
                <i className="bi bi-list-ul me-2"></i>
                Ver Inventario
              </button>
              <button 
                className="btn btn-outline-secondary btn-lg"
                onClick={() => navigate('/lista-productos')}
              >
                <i className="bi bi-eye me-2"></i>
                Vista Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}