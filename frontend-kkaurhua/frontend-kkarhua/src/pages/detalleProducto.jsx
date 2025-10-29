import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProducto(data);

      // Cargar productos relacionados de la misma categoría
      const todosProductos = await getProducts();
      const relacionados = todosProductos
        .filter(p => 
          p.categoria === data.categoria && 
          p.id !== data.id && 
          p.estado === 'activo'
        )
        .slice(0, 4);
      setProductosRelacionados(relacionados);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = () => {
    if (producto.stock === 0) {
      alert('Producto sin stock');
      return;
    }

    if (cantidad > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }

    // Obtener carrito actual
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Cargando producto...</p>
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
          <div className="alert alert-danger">{error || 'Producto no encontrado'}</div>
          <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
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
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            <li className="breadcrumb-item active">{producto.nombre}</li>
          </ol>
        </nav>
        
        <div className="row">
          <div className="col-md-6">
            <img
              src={producto.imagen ? `http://localhost:8000/api/imagenes/${producto.imagen}` : 'https://via.placeholder.com/500'}
              alt={producto.nombre}
              className="img-fluid rounded shadow"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500?text=Sin+imagen';
              }}
            />
          </div>
          
          <div className="col-md-6">
            <h2 className="mb-3">{producto.nombre}</h2>
            
            <div className="mb-3">
              <span className="badge bg-info text-dark me-2">{producto.categoria}</span>
              {producto.stock === 0 ? (
                <span className="badge bg-danger">Sin stock</span>
              ) : producto.stock < 5 ? (
                <span className="badge bg-warning text-dark">
                  Solo {producto.stock} unidades
                </span>
              ) : (
                <span className="badge bg-success">Disponible</span>
              )}
            </div>
            
            <h3 className="text-primary mb-4">${producto.precio.toLocaleString()}</h3>
            
            <div className="mb-4">
              <h5>Descripción</h5>
              <p className="text-muted">{producto.descripcion}</p>
            </div>
            
            <div className="mb-4">
              <h6>Detalles del producto</h6>
              <ul className="list-unstyled">
                <li><strong>Stock disponible:</strong> {producto.stock} unidades</li>
                <li><strong>Categoría:</strong> {producto.categoria}</li>
                <li><strong>Código:</strong> #{producto.id}</li>
              </ul>
            </div>
            
            {producto.stock > 0 && (
              <form onSubmit={(e) => { e.preventDefault(); agregarAlCarrito(); }}>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">
                    <strong>Cantidad</strong>
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    className="form-control w-25"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    min="1"
                    max={producto.stock}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-cart-plus me-2"></i>
                  Añadir al carrito
                </button>
              </form>
            )}
          </div>
        </div>
        
        <hr className="my-5" />
        
        {productosRelacionados.length > 0 && (
          <div>
            <h4 className="mb-4">Productos Relacionados</h4>
            <div className="row">
              {productosRelacionados.map(prod => (
                <div key={prod.id} className="col-md-3 mb-3">
                  <Link to={`/producto/${prod.id}`} className="text-decoration-none">
                    <div className="card h-100">
                      <img
                        src={prod.imagen ? `http://localhost:8000/api/imagenes/${prod.imagen}` : 'https://via.placeholder.com/150'}
                        className="card-img-top"
                        alt={prod.nombre}
                        style={{ height: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{prod.nombre}</h6>
                        <p className="text-primary mb-0">${prod.precio.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}