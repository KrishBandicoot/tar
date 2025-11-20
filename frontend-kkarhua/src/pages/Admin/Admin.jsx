import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Admin.css';

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
      navigate('/');
      alert('Sesión cerrada exitosamente');
    }
  };

  const menuItems = [
    {
      icon: 'bi-speedometer2',
      label: 'Dashboard',
      path: '/admin'
    },
    {
      icon: 'bi-box-seam',
      label: 'Productos',
      path: '/productos'
    },
    {
      icon: 'bi-plus-circle',
      label: 'Crear Producto',
      path: '/crear-producto'
    },
    {
      icon: 'bi-shop',
      label: 'Ver Tienda',
      path: '/lista-productos'
    },
    {
      icon: 'bi-house',
      label: 'Inicio',
      path: '/'
    }
  ];

  const stats = [
    {
      title: 'Compras',
      value: '1.234',
      subtitle: 'Probabilidad de aumento: 29%',
      color: '#0d6efd',
      icon: 'bi-cart-check'
    },
    {
      title: 'Productos',
      value: '400',
      subtitle: 'Inventario actual: 500',
      color: '#28a745',
      icon: 'bi-box-seam'
    },
    {
      title: 'Usuarios',
      value: '890',
      subtitle: 'Nuevos registros: 124',
      color: '#ffc107',
      icon: 'bi-people'
    }
  ];

  const quickMenus = [
    {
      icon: 'bi-speedometer2',
      title: 'Dashboard',
      desc: 'Ver estadísticas y datos generales del sistema',
      path: '/admin'
    },
    {
      icon: 'bi-cart3',
      title: 'Órdenes',
      desc: 'Gestionar todas las órdenes de compra',
      path: '/ordenes'
    },
    {
      icon: 'bi-box-seam',
      title: 'Productos',
      desc: 'Administrar inventario y detalles de productos',
      path: '/productos'
    },
    {
      icon: 'bi-tags',
      title: 'Categorías',
      desc: 'Organizar productos por categorías',
      path: '/categorias'
    },
    {
      icon: 'bi-person-circle',
      title: 'Perfil',
      desc: 'Ver información personal y configurar cuenta',
      path: '#'
    },
    {
      icon: 'bi-shop',
      title: 'Tienda',
      desc: 'Visualizar la tienda tal como ven los clientes',
      path: '/lista-productos'
    }
  ];

  return (
    <>
      <AdminNavbar />

      <div className="admin-wrapper">
        {/* Sidebar */}
        <Sidebar menuItems={menuItems} currentPath="/admin" />

        {/* Main Content */}
        <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          {/* Header */}
          <div className="admin-header">
            <div className="header-left">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Bienvenido, <strong>{user?.nombre}</strong></p>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              Cerrar Sesión
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-container">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="stat-content">
                  <div>
                    <p className="stat-title">{stat.title}</p>
                    <h2 className="stat-value" style={{ color: stat.color }}>
                      {stat.value}
                    </h2>
                    <p className="stat-subtitle">{stat.subtitle}</p>
                  </div>
                  <i className={`bi ${stat.icon}`} style={{ color: stat.color }}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Menu */}
          <div className="quick-menu-section">
            <h3 className="section-title">Acceso Rápido</h3>
            <div className="quick-menu-grid">
              {quickMenus.map((menu, idx) => (
                <div
                  key={idx}
                  className="quick-menu-card"
                  onClick={() => navigate(menu.path)}
                >
                  <i className={`bi ${menu.icon}`}></i>
                  <h5>{menu.title}</h5>
                  <p>{menu.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}