// src/context/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    // Cargar carrito del localStorage al iniciar
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === producto.id);
      
      if (itemExistente) {
        // Si ya existe, aumentar cantidad
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        return [...prevItems, { ...producto, cantidad }];
      }
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const obtenerTotal = () => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const obtenerCantidadTotal = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const valor = {
    items,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal
  };

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  );
}