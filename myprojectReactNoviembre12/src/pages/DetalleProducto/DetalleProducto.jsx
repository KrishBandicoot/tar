import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { Footer } from '../../componentes/Footer/Footer';
import './DetalleProducto.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    cargarProducto();
    cargarProductosRelacionados();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }

      const data = await response.json();
      setProducto(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar producto:', err);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const cargarProductosRelacionados = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar el producto actual y tomar solo 5 productos
        const relacionados = data
          .filter(p => p.id !== parseInt(id) && p.activo)
          .slice(0, 5);
        setProductosRelacionados(relacionados);
      }
    } catch (err) {
      console.error('Error al cargar productos relacionados:', err);
    }
  };

  const handleAgregarCarrito = () => {
    alert(`Agregado al carrito: ${cantidad} x ${producto.nombre}`);
    // Aquí puedes agregar la lógica real del carrito
  };

  const handleCantidadChange = (e) => {
    const valor = parseInt(e.target.value);
    if (valor > 0) {
      setCantidad(valor);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !producto) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error || 'Producto no encontrado'}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="detalle-producto-container">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/">Productos</Link>
            <span>›</span>
            <span>{producto.nombre}</span>
          </nav>

          {/* Contenido del producto */}
          <div className="producto-content">
            {/* Sección de imágenes */}
            <div className="producto-imagenes">
              <div className="imagen-principal">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} />
                ) : (
                  <div className="imagen-placeholder">📷</div>
                )}
              </div>
              
              <div className="miniaturas">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index}
                    className={`miniatura ${imagenActual === index ? 'active' : ''}`}
                    onClick={() => setImagenActual(index)}
                  >
                    {producto.imagen && index === 0 ? (
                      <img src={producto.imagen} alt={`Vista ${index + 1}`} />
                    ) : (
                      <div style={{ fontSize: '24px', color: '#adb5bd' }}>📷</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de información */}
            <div className="producto-info">
              <div className="producto-header">
                <h1 className="producto-titulo">{producto.nombre}</h1>
                <p className="producto-precio">${producto.precio}</p>
              </div>

              <p className="producto-descripcion">
                {producto.descripcion || 
                  'Las manzanas son una fruta deliciosa y versátil, apreciada en todo el mundo por su sabor refrescante y sus numerosos beneficios para la salud. Disponibles en una variedad de colores, desde el rojo brillante hasta el verde brillante y el amarillo dorado, las manzanas son perfectas para cualquier ocasión, ya sea como un refrigerio saludable.'}
              </p>

              <div className="cantidad-section">
                <label className="cantidad-label">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  className="cantidad-input"
                />
              </div>

              <button 
                className="btn-agregar-carrito"
                onClick={handleAgregarCarrito}
              >
                Añadir al carrito
              </button>
            </div>
          </div>

          {/* Productos relacionados */}
          {productosRelacionados.length > 0 && (
            <div className="productos-relacionados">
              <h3>Related Products</h3>
              <div className="productos-grid">
                {productosRelacionados.map((prod) => (
                  <div 
                    key={prod.id}
                    className="producto-relacionado"
                    onClick={() => navigate(`/producto/${prod.id}`)}
                  >
                    <div className="producto-relacionado-img">
                      {prod.imagen ? (
                        <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '📷'
                      )}
                    </div>
                    <div className="producto-relacionado-info">
                      <div className="producto-relacionado-nombre">
                        {prod.nombre}
                      </div>
                      <div className="producto-relacionado-precio">
                        ${prod.precio}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}