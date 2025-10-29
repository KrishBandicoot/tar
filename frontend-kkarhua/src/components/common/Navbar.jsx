import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logoutUser();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/dashboard">
          <i className="bi bi-shop me-2"></i>
          Tienda Virtual
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">
                <i className="bi bi-box-seam me-1"></i>
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios">
                <i className="bi bi-people me-1"></i>
                Usuarios
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <span className="text-muted me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user?.nombre || 'Usuario'}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;