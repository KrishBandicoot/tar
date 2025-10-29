import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Cargar carrito desde almacenamiento
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoGuardado);
    
    const totalCalculado = carritoGuardado.reduce((sum, item) => 
      sum + (item.precio * item.cantidad), 0
    );
    setTotal(totalCalculado);
  }, []);

  return (
    <>
      <Navbar />
      
      <div className="container mt-5">
        <h2 className="mb-4">Mi carrito de compras</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody id="carrito-items">
            {carrito.map((item, index) => (
              <tr key={index}>
                <td><img src={item.imagen} alt={item.nombre} style={{ width: '50px' }} /></td>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.precio}</td>
                <td>${item.precio * item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <h4>Total: $<span id="carrito-total">{total}</span></h4>
        </div>
      </div>
      <Footer />
    </>
  );
};