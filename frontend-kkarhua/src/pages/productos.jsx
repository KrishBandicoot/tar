import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos desde almacenamiento o API
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(productosGuardados);
  }, []);

  return (
    <>
      <Navbar />
      
      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Productos</li>
          </ol>
        </nav>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th colSpan="4"><h3>Lista de Productos</h3></th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Precio</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>
                  <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px' }} />
                </td>
                <td>${producto.precio}</td>
                <td>{producto.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};