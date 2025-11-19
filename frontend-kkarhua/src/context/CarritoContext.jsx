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
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === producto.id);
      
      if (itemExistente) {
        // Verificar que no exceda el stock
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        const stockDisponible = producto.stock || 0;
        
        if (nuevaCantidad > stockDisponible) {
          alert(`Solo hay ${stockDisponible} unidades disponibles de ${producto.nombre}`);
          return prevItems.map(item =>
            item.id === producto.id
              ? { ...item, cantidad: stockDisponible }
              : item
          );
        }
        
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      } else {
        // Verificar stock al agregar nuevo producto
        const stockDisponible = producto.stock || 0;
        if (cantidad > stockDisponible) {
          alert(`Solo hay ${stockDisponible} unidades disponibles de ${producto.nombre}`);
          return [...prevItems, { ...producto, cantidad: stockDisponible }];
        }
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
      prevItems.map(item => {
        if (item.id === productoId) {
          const stockDisponible = item.stock || 0;
          
          // Validar que no exceda el stock
          if (nuevaCantidad > stockDisponible) {
            alert(`Solo hay ${stockDisponible} unidades disponibles de ${item.nombre}`);
            return { ...item, cantidad: stockDisponible };
          }
          
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
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