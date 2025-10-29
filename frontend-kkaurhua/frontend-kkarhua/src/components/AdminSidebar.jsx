import React from 'react';
import { Link } from 'react-router-dom';

export const AdminSidebar = () => {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark d-md-none">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">Kkarhua</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="sidebarOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Kkarhua</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            <Link className="nav-link" to="/admin/home">
              <i className="bi bi-grid"></i> Dashboard
            </Link>
            <Link className="nav-link" to="/admin/usuarios">
              <i className="bi bi-person"></i> Usuarios
            </Link>
            <Link className="nav-link" to="/admin/agregar-usuario">
              <i className="bi bi-person"></i> Agregar Usuario
            </Link>
            <Link className="nav-link" to="/admin/modificar-usuario">
              <i className="bi bi-person"></i> Modificar Usuario
            </Link>
            <Link className="nav-link" to="/admin/productos">
              <i className="bi bi-box"></i> Productos
            </Link>
            <Link className="nav-link" to="/admin/agregar-producto">
              <i className="bi bi-box"></i> Agregar Productos
            </Link>
            <Link className="nav-link" to="#">
              <i className="bi bi-people"></i> Clientes
            </Link>
            <Link className="nav-link" to="#">
              <i className="bi bi-gear"></i> Configuración
            </Link>
            <Link className="nav-link" to="#">
              <i className="bi bi-search"></i> Buscar
            </Link>
            <Link className="nav-link" to="#">
              <i className="bi bi-question-circle"></i> Ayuda
            </Link>
            <div className="profile-link mt-3">
              <i className="bi bi-person-circle"></i> <span id="username">Perfil</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="col-md-2 sidebar d-none d-md-block">
        <div className="logo mb-4">
          <i className="bi bi-circle"></i> Kkarhua
        </div>
        <nav className="nav flex-column">
          <Link className="nav-link" to="/admin/home">
            <i className="bi bi-grid"></i> Dashboard
          </Link>
          <Link className="nav-link" to="/admin/usuarios">
            <i className="bi bi-person"></i> Usuarios
          </Link>
          <Link className="nav-link" to="/admin/agregar-usuario">
            <i className="bi bi-person"></i> Agregar Usuario
          </Link>
          <Link className="nav-link" to="/admin/modificar-usuario">
            <i className="bi bi-person"></i> Modificar Usuario
          </Link>
          <Link className="nav-link" to="/admin/productos">
            <i className="bi bi-box"></i> Productos
          </Link>
          <Link className="nav-link" to="/admin/agregar-producto">
            <i className="bi bi-box"></i> Agregar Productos
          </Link>
          <Link className="nav-link" to="#">
            <i className="bi bi-people"></i> Clientes
          </Link>
          <Link className="nav-link" to="#">
            <i className="bi bi-gear"></i> Configuración
          </Link>
          <Link className="nav-link" to="#">
            <i className="bi bi-search"></i> Buscar
          </Link>
          <Link className="nav-link" to="#">
            <i className="bi bi-question-circle"></i> Ayuda
          </Link>
          <div className="profile-link mt-3">
            <i className="bi bi-person-circle"></i> <span id="username">Perfil</span>
          </div>
        </nav>
      </div>
    </>
  );
};