import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { getAllProducts, getLowStockProducts } from '../services/productService';
import { getAllUsers } from '../services/userService';
import { isAuthenticated } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    productosStockBajo: 0
  });
  
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productos, usuarios, stockBajo] = await Promise.all([
        getAllProducts(),
        getAllUsers(),
        getLowStockProducts(5)
      ]);
      
      setStats({
        totalProductos: productos.length,
        totalUsuarios: usuarios.length,
        productosStockBajo: stockBajo.length
      });
      
      setLowStockProducts(stockBajo);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary spinner-border-custom" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          <h1 className="mb-4 fw-bold">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h1>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-box-seam text-primary" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total de Productos</h6>
                      <h2 className="mb-0 fw-bold">{stats.totalProductos}</h2>
                    </div>
                  </div>
                  <Link to="/productos" className="btn btn-outline-primary btn-sm w-100">
                    Ver todos <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-people text-success" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total de Usuarios</h6>
                      <h2 className="mb-0 fw-bold">{stats.totalUsuarios}</h2>
                    </div>
                  </div>
                  <Link to="/usuarios" className="btn btn-outline-success btn-sm w-100">
                    Ver todos <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 border-start border-danger border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Stock Crítico</h6>
                      <h2 className="mb-0 fw-bold text-danger">{stats.productosStockBajo}</h2>
                    </div>
                  </div>
                  <div className="text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Menos de 5 unidades
                  </div>
                </div>
              </div>
            </div>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                  Alertas de Stock Crítico
                </h5>
                <p className="text-muted small mb-0">Productos que requieren atención inmediata</p>
              </div>
              <div className="list-group list-group-flush">
                {lowStockProducts.map((producto) => (
                  <div key={producto.id} className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{producto.nombre}</h6>
                        <small className="text-muted">
                          {producto.categoria?.nombre || 'Sin categoría'}
                        </small>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-danger mb-2">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          Stock: {producto.stock}
                        </span>
                        <br />
                        <Link
                          to={`/productos/editar/${producto.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Actualizar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <h5 className="fw-bold">
              <i className="bi bi-lightning-charge me-2"></i>
              Acceso Rápido
            </h5>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <Link to="/productos" className="text-decoration-none">
                <div className="card border-0 shadow-sm hover-shadow transition">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-box-seam text-primary" style={{ fontSize: '2rem' }}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1 fw-bold">Gestión de Productos</h5>
                        <p className="text-muted mb-0 small">Administrar inventario y productos</p>
                      </div>
                      <i className="bi bi-arrow-right text-muted"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-6">
              <Link to="/usuarios" className="text-decoration-none">
                <div className="card border-0 shadow-sm hover-shadow transition">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-people text-success" style={{ fontSize: '2rem' }}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1 fw-bold">Gestión de Usuarios</h5>
                        <p className="text-muted mb-0 small">Administrar usuarios del sistema</p>
                      </div>
                      <i className="bi bi-arrow-right text-muted"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;