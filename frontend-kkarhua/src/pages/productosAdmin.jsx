// src/pages/admin/ProductosAdmin.jsx
import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { getProducts, deleteProduct } from '../../services/api';

export function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, filterCategoria, productos]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts();
      setProductos(data);
      setFilteredProductos(data);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarProductos = () => {
    let resultado = [...productos];

    // Filtro por búsqueda en tiempo real
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    // Filtro por categoría
    if (filterCategoria !== 'todas') {
      resultado = resultado.filter(p => p.categoria === filterCategoria);
    }

    setFilteredProductos(resultado);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    try {
      await deleteProduct(id);
      setSuccessMessage('Producto eliminado correctamente');
      cargarProductos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al eliminar producto: ' + err.message);
    }
  };

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))].filter(Boolean);

  const getStockBadgeClass = (stock) => {
    if (stock === 0) return 'bg-danger';
    if (stock < 5) return 'bg-warning text-dark';
    return 'bg-success';
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Productos</h1>
            <a href="/admin/productos/agregar" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Producto
            </a>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <small className="text-muted">
                      Búsqueda en tiempo real: {filteredProductos.length} resultado(s)
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategoria('todas');
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <i className="bi bi-inbox fs-1 text-muted"></i>
                            <p className="text-muted mt-2">
                              {searchTerm || filterCategoria !== 'todas' 
                                ? 'No se encontraron productos con los filtros aplicados' 
                                : 'No hay productos registrados'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredProductos.map(producto => (
                          <tr key={producto.id}>
                            <td>
                              {producto.imagen ? (
                                <img 
                                  src={`http://localhost:8000/api/imagenes/${producto.imagen}`}
                                  alt={producto.nombre}
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                  className="rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60';
                                  }}
                                />
                              ) : (
                                <div 
                                  style={{ width: '60px', height: '60px' }}
                                  className="bg-light rounded d-flex align-items-center justify-content-center"
                                >
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                              )}
                            </td>
                            <td>
                              <strong>{producto.nombre}</strong>
                              {producto.descripcion && (
                                <><br /><small className="text-muted">{producto.descripcion.substring(0, 50)}...</small></>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-info text-dark">
                                {producto.categoria || 'Sin categoría'}
                              </span>
                            </td>
                            <td className="fw-bold">
                              ${producto.precio.toLocaleString()}
                            </td>
                            <td>
                              <span className={`badge ${getStockBadgeClass(producto.stock)}`}>
                                {producto.stock} unidades
                              </span>
                              {producto.stock < 5 && producto.stock > 0 && (
                                <><br /><small className="text-warning">
                                  <i className="bi bi-exclamation-triangle"></i> Stock bajo
                                </small></>
                              )}
                              {producto.stock === 0 && (
                                <><br /><small className="text-danger">
                                  <i className="bi bi-x-circle"></i> Sin stock
                                </small></>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${
                                producto.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                              }`}>
                                {producto.estado || 'activo'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <a 
                                  href={`/admin/productos/modificar/${producto.id}`}
                                  className="btn btn-outline-primary"
                                  title="Editar"
                                >
                                  <i className="bi bi-pencil"></i>
                                </a>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(producto.id)}
                                  title="Eliminar"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted">
                    Mostrando {filteredProductos.length} de {productos.length} productos
                  </span>
                  {filteredProductos.some(p => p.stock < 5) && (
                    <span className="badge bg-warning text-dark">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {filteredProductos.filter(p => p.stock < 5 && p.stock > 0).length} productos con stock bajo
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}