import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Cargar producto desde API o almacenamiento
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const productoEncontrado = productos.find(p => p.id === id);
    setProducto(productoEncontrado);
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push({ ...producto, cantidad });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
  };

  if (!producto) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />
      
      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
          </ol>
        </nav>
        
        <div className="row">
          <div className="col-md-7">
            <img src={producto.imagen} className="foto-principal mb-3" alt={producto.nombre} />
          </div>
          <div className="col-md-5">
            <div className="product-title">{producto.nombre}</div>
            <div className="product-price">${producto.precio}</div>
            <div className="product-desc">
              <span>{producto.descripcion}</span>
            </div>
            <form className="mt-4" onSubmit={(e) => { e.preventDefault(); agregarAlCarrito(); }}>
              <label htmlFor="cantidad"><strong>Cantidad</strong></label>
              <input type="number" id="cantidad" className="qty-input" 
                value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
              <button type="submit" className="btn btn-primary add-cart-btn mt-3">
                Añadir al carrito
              </button>
            </form>
          </div>
        </div>
        
        <hr />
        
        <div>
          <h5>Productos Relacionados</h5>
          <div className="d-flex">
            <img src="img/collar.jpg" className="related-img" alt="Relacionado 1" />
            <img src="img/collar_de_moda.png" className="related-img" alt="Relacionado 2" />
            <img src="img/Anillos_De Estilo_Punk_Con_Forma_De_Cabeza_De_Calavera.png" className="related-img" alt="Relacionado 3" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};