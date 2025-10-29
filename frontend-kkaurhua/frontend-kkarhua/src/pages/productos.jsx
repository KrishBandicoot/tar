import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      // Filtrar solo productos activos para la vista pública
      const productosActivos = data.filter(p => p.estado === 'activo');
      setProductos(productosActivos);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const matchNombre = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !categoriaFilter || producto.categoria === categoriaFilter;
    return matchNombre && matchCategoria;
  });

  const categorias = [...new Set(productos.map(p => p.categoria))].filter(Boolean);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Productos</li>
          </ol>
        </nav>

        <h2 className="mb-4">Nuestros Productos</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="alert alert-info">
            No se encontraron productos.
          </div>
        ) : (
          <div className="row">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="col-md-3 mb-4">
                <div className="card h-100">
                  {producto.stock === 0 && (
                    <span className="badge bg-danger position-absolute" style={{ top: '10px', right: '10px', zIndex: 1 }}>
                      Agotado
                    </span>
                  )}
                  {producto.stock > 0 && producto.stock < 5 && (
                    <span className="badge bg-warning text-dark position-absolute" style={{ top: '10px', right: '10px', zIndex: 1 }}>
                      ¡Últimas unidades!
                    </span>
                  )}
                  
                  <img
                    src={producto.imagen ? `http://localhost:8000/api/imagenes/${producto.imagen}` : 'https://via.placeholder.com/200'}
                    className="card-img-top"
                    alt={producto.nombre}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200?text=Sin+imagen';
                    }}
                  />
                  
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text text-muted small flex-grow-1">
                      {producto.descripcion?.substring(0, 80)}...
                    </p>
                    <div className="mb-2">
                      <span className="badge bg-info text-dark">{producto.categoria}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-primary mb-0">${producto.precio.toLocaleString()}</h4>
                      <Link 
                        to={`/producto/${producto.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}