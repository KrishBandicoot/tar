import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { Footer } from '../../componentes/Footer/Footer';
import { CheckoutModal } from '../../componentes/CheckoutModal/CheckoutModal';
import './Carrito.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Carrito() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, obtenerTotal } = useCarrito();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const getImageUrl = (imagen) => {
    if (!imagen) return 'https://via.placeholder.com/80x80?text=Sin+Imagen';
    if (imagen.startsWith('http')) return imagen;
    return `${API_BASE_URL}/imagenes/${imagen}`;
  };

  const handleCantidadChange = (id, nuevaCantidad, stock) => {
    if (nuevaCantidad >= 1) {
      // Validar que no exceda el stock
      if (nuevaCantidad > stock) {
        alert(`Solo hay ${stock} unidades disponibles`);
        actualizarCantidad(id, stock);
      } else {
        actualizarCantidad(id, nuevaCantidad);
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // Si no está logeado, redirigir a login
      localStorage.setItem('intendedPurchase', 'true');
      navigate('/IniciarSesion?redirect=/carrito');
      return;
    }

    // Si está logeado, abrir el modal
    setCheckoutOpen(true);
  };

  const handleVerDetalleProducto = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="carrito-vacio-container">
          <div className="container text-center py-5">
            <i className="bi bi-cart-x" style={{ fontSize: '80px', color: '#6c757d' }}></i>
            <h2 className="mt-4">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/lista-productos')}
            >
              Ver Productos
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
      
      <div className="carrito-container">
        <div className="container">
          <div className="carrito-header">
            <h1>Mi carrito de compras</h1>
          </div>

          <div className="row">
            {/* Lista de productos */}
            <div className="col-lg-8 mb-4">
              <div className="card">
                <div className="card-body">
                  {items.map((item) => (
                    <div key={item.id} className="carrito-item">
                      {/* Imagen clickeable */}
                      <div 
                        className="item-imagen" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleVerDetalleProducto(item.id)}
                        title="Ver detalles del producto"
                      >
                        <img 
                          src={getImageUrl(item.imagen)} 
                          alt={item.nombre}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=Sin+Imagen';
                          }}
                        />
                      </div>

                      {/* Info del producto - también clickeable */}
                      <div 
                        className="item-info"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleVerDetalleProducto(item.id)}
                      >
                        <h5 className="item-nombre" style={{ color: '#0d6efd' }}>
                          {item.nombre}
                        </h5>
                        <p className="item-descripcion">
                          {item.descripcion && item.descripcion.length > 60
                            ? item.descripcion.substring(0, 60) + '...'
                            : item.descripcion}
                        </p>
                        {/* Mostrar stock disponible */}
                        <small className="text-muted">
                          Stock disponible: {item.stock || 0} unidades
                        </small>
                      </div>

                      <div className="item-cantidad">
                        <button 
                          className="btn-cantidad"
                          onClick={() => handleCantidadChange(item.id, item.cantidad - 1, item.stock)}
                        >
                          <i className="bi bi-dash-circle"></i>
                        </button>
                        <input 
                          type="number"
                          className="cantidad-input"
                          value={item.cantidad}
                          onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value) || 1, item.stock)}
                          min="1"
                          max={item.stock || 1}
                        />
                        <button 
                          className="btn-cantidad"
                          onClick={() => handleCantidadChange(item.id, item.cantidad + 1, item.stock)}
                          disabled={item.cantidad >= (item.stock || 0)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </div>

                      <div className="item-precio">
                        <p className="precio-unitario">
                          ${item.precio.toLocaleString('es-CL')}
                        </p>
                        <p className="precio-total">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </p>
                      </div>

                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarDelCarrito(item.id)}
                        title="Eliminar producto"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}

                  <div className="carrito-acciones">
                    <button 
                      className="btn btn-outline-danger"
                      onClick={vaciarCarrito}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Vaciar Carrito
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/lista-productos')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="col-lg-4">
              <div className="card resumen-card">
                <div className="card-body">
                  <h4 className="card-title mb-4">TOTAL</h4>
                  
                  <div className="resumen-item">
                    <span>Subtotal:</span>
                    <span>${obtenerTotal().toLocaleString('es-CL')}</span>
                  </div>

                  <div className="resumen-total">
                    <span>Total:</span>
                    <span>${obtenerTotal().toLocaleString('es-CL')}</span>
                  </div>

                  <button 
                    className="btn btn-success w-100 btn-lg mt-3"
                    onClick={handleCheckout}
                  >
                    <i className="bi bi-bag-check me-2"></i>
                    CHECKOUT
                  </button>

                  <div className="info-envio mt-4">
                    <p className="text-muted small mb-2">
                      <i className="bi bi-truck me-2"></i>
                      Envío gratis en compras sobre $30.000
                    </p>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-shield-check me-2"></i>
                      Compra 100% segura
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={obtenerTotal()}
        items={items}
      />

      <Footer />
    </>
  );
}