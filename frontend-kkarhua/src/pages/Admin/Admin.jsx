import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Admin.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalProductos: 0,
    productosActivos: 0,
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalCompras: 0,
    loading: true,
    error: null
  });

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
      icon: 'bi-people',
      label: 'Usuarios',
      path: '/usuarios'
    },
    {
      icon: 'bi-person-plus',
      label: 'Crear Usuario',
      path: '/crear-usuario'
    },
    { 
      icon: 'bi-tag', 
      label: 'Categorías', 
      path: '/categorias' 
    },
    {
      icon: 'bi-truck',
      label: 'Envíos',
      path: '/envios'
    },
    { icon: 'bi-cart-check', label: 'Compras', path: '/compras'},
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

  const quickMenus = [
    {
      icon: 'bi-cart-check', 
      title: 'Compras', 
      desc: 'Revisar todas las compras realizadas',
      path: '/compras'
    },
    {
      icon: 'bi-truck',
      title: 'Envíos',
      desc: 'Gestionar direcciones de envío registradas',
      path: '/envios'
    },
    {
      icon: 'bi-box-seam',
      title: 'Productos',
      desc: 'Administrar inventario y detalles de productos',
      path: '/productos'
    },
    {
      icon: 'bi-plus-square',
      title: 'Crear Producto',
      desc: 'Agregar nuevos productos al inventario',
      path: '/crear-producto'
    },
    {
      icon: 'bi-people',
      title: 'Usuarios',
      desc: 'Gestionar usuarios y sus permisos',
      path: '/usuarios'
    },
    {
      icon: 'bi-person-plus',
      title: 'Crear Usuario',
      desc: 'Agregar nuevos usuarios al sistema',
      path: '/crear-usuario'
    },
    {
      icon: 'bi-tags',
      title: 'Categorías',
      desc: 'Organizar productos por categorías',
      path: '/categorias'
    },
    {
      icon: 'bi-shop',
      title: 'Tienda',
      desc: 'Visualizar la tienda tal como ven los clientes',
      path: '/lista-productos'
    }
  ];

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem('accessToken');
      const headers = token 
        ? { 'Authorization': `Bearer ${token}` } 
        : {};

      console.log('🔄 Cargando estadísticas...');

      // Cargar productos
      console.log('📦 Cargando productos...');
      const productosResponse = await fetch(`${API_BASE_URL}/productos`, {
        headers
      });

      // Cargar usuarios
      console.log('👥 Cargando usuarios...');
      const usuariosResponse = await fetch(`${API_BASE_URL}/usuarios`, {
        headers
      });

      // Cargar compras
      console.log('🛒 Cargando compras...');
      let totalCompras = 0;
      try {
        const comprasResponse = await fetch(`${API_BASE_URL}/compras`, {
          headers
        });
        
        if (comprasResponse.ok) {
          const comprasData = await comprasResponse.json();
          totalCompras = Array.isArray(comprasData) ? comprasData.length : 0;
          console.log('✅ Compras cargadas:', totalCompras);
        } else {
          console.warn('⚠️ Error al cargar compras:', comprasResponse.status);
        }
      } catch (err) {
        console.warn('⚠️ No se pudieron cargar las compras:', err.message);
      }

      if (!productosResponse.ok) {
        throw new Error(`Error al cargar productos: ${productosResponse.status}`);
      }

      if (!usuariosResponse.ok) {
        throw new Error(`Error al cargar usuarios: ${usuariosResponse.status}`);
      }

      const productos = await productosResponse.json();
      const usuarios = await usuariosResponse.json();

      console.log('✅ Productos cargados:', productos.length);
      console.log('✅ Usuarios cargados:', usuarios.length);

      const productosActivos = productos.filter(p => p.estado === 'activo').length;
      const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;

      setStats({
        totalProductos: productos.length,
        productosActivos: productosActivos,
        totalUsuarios: usuarios.length,
        usuariosActivos: usuariosActivos,
        totalCompras: totalCompras,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: `Error: ${error.message}`
      }));
    }
  };

  const statsCards = [
    {
      title: 'Productos',
      value: stats.totalProductos.toString(),
      subtitle: `${stats.productosActivos} activos`,
      color: '#28a745',
      icon: 'bi-box-seam'
    },
    {
      title: 'Usuarios',
      value: stats.totalUsuarios.toString(),
      subtitle: `${stats.usuariosActivos} activos`,
      color: '#ffc107',
      icon: 'bi-people'
    },
    {
      title: 'Compras Realizadas',
      value: stats.totalCompras.toString(),
      subtitle: 'Total de compras en el sistema',
      color: '#0d6efd',
      icon: 'bi-cart-check'
    }
  ];

  return (
    <>
      <AdminNavbar />

      <div className="admin-wrapper">
        <Sidebar menuItems={menuItems} currentPath="/admin" />

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
            {stats.loading ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando estadísticas...</p>
              </div>
            ) : stats.error ? (
              <div style={{ gridColumn: '1 / -1' }} className="alert alert-danger">
                {stats.error}
                <button 
                  className="btn btn-sm btn-primary ms-2"
                  onClick={cargarEstadisticas}
                >
                  Reintentar
                </button>
              </div>
            ) : (
              statsCards.map((stat, idx) => (
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
              ))
            )}
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