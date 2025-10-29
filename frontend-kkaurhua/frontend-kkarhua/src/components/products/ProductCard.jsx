import { Link } from 'react-router-dom';

const ProductCard = ({ product, onStatusChange }) => {
  const isLowStock = product.stock < 5;
  const isInactive = product.estado === 'inactivo';

  const handleStatusToggle = () => {
    const newStatus = product.estado === 'activo' ? 'inactivo' : 'activo';
    const confirmMessage = newStatus === 'inactivo'
      ? `¿Está seguro de desactivar el producto "${product.nombre}"?`
      : `¿Está seguro de activar el producto "${product.nombre}"?`;

    if (window.confirm(confirmMessage)) {
      onStatusChange(product.id, newStatus);
    }
  };

  return (
    <div className={`card mb-3 ${isInactive ? 'opacity-75' : ''}`}>
      <div className="card-body">
        <div className="row align-items-center">
          {product.imagen && (
            <div className="col-auto">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="rounded"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=Sin+imagen';
                }}
              />
            </div>
          )}
          
          <div className="col">
            <div className="d-flex align-items-center mb-2">
              <h5 className="card-title mb-0 me-2">{product.nombre}</h5>
              
              {isLowStock && product.estado === 'activo' && (
                <span className="badge bg-danger">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  Stock bajo: {product.stock}
                </span>
              )}
              
              {isInactive && (
                <span className="badge bg-secondary">Inactivo</span>
              )}
            </div>
            
            <p className="card-text text-muted small mb-2">{product.descripcion}</p>
            
            <div className="d-flex gap-3 text-muted small">
              <span className="fw-bold">${product.precio.toLocaleString()}</span>
              <span>•</span>
              <span>Stock: {product.stock}</span>
              <span>•</span>
              <span>{product.categoria?.nombre || 'Sin categoría'}</span>
            </div>
          </div>
          
          <div className="col-auto">
            <div className="btn-group" role="group">
              <Link
                to={`/productos/editar/${product.id}`}
                className={`btn btn-sm btn-outline-primary ${isInactive ? 'disabled' : ''}`}
                onClick={(e) => isInactive && e.preventDefault()}
              >
                <i className="bi bi-pencil me-1"></i>
                Editar
              </Link>
              
              <button
                onClick={handleStatusToggle}
                className={`btn btn-sm ${isInactive ? 'btn-outline-success' : 'btn-outline-danger'}`}
              >
                {isInactive ? 'Activar' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;