// src/context/CarritoContext.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CarritoProvider, useCarrito } from './CarritoContext'

// Mock de window.alert
global.alert = vi.fn()

// Componente de prueba para acceder al contexto
function TestComponent() {
  const {
    items,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal
  } = useCarrito()

  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="total">{obtenerTotal()}</div>
      <div data-testid="cantidad-total">{obtenerCantidadTotal()}</div>
      
      <button
        onClick={() =>
          agregarAlCarrito({
            id: 1,
            nombre: 'Producto Test',
            precio: 1000,
            stock: 10
          })
        }
      >
        Agregar Producto
      </button>
      
      <button onClick={() => actualizarCantidad(1, 3)}>
        Actualizar Cantidad
      </button>
      
      <button onClick={() => eliminarDelCarrito(1)}>
        Eliminar Producto
      </button>
      
      <button onClick={vaciarCarrito}>Vaciar Carrito</button>
      
      {items.map((item) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          <span data-testid={`item-${item.id}-nombre`}>{item.nombre}</span>
          <span data-testid={`item-${item.id}-cantidad`}>{item.cantidad}</span>
          <span data-testid={`item-${item.id}-precio`}>{item.precio}</span>
        </div>
      ))}
    </div>
  )
}

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('debe agregar un producto al carrito correctamente', async () => {
    const user = userEvent.setup()
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    // Verificar estado inicial
    expect(screen.getByTestId('items-count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')

    // Agregar producto
    await user.click(screen.getByText('Agregar Producto'))

    // Verificar que el producto se agregó
    await waitFor(() => {
      expect(screen.getByTestId('items-count')).toHaveTextContent('1')
      expect(screen.getByTestId('item-1-nombre')).toHaveTextContent('Producto Test')
      expect(screen.getByTestId('item-1-cantidad')).toHaveTextContent('1')
      expect(screen.getByTestId('total')).toHaveTextContent('1000')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('1')
    })
  })

  it('debe actualizar la cantidad de un producto', async () => {
    const user = userEvent.setup()
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    // Agregar producto primero
    await user.click(screen.getByText('Agregar Producto'))

    await waitFor(() => {
      expect(screen.getByTestId('item-1-cantidad')).toHaveTextContent('1')
    })

    // Actualizar cantidad
    await user.click(screen.getByText('Actualizar Cantidad'))

    await waitFor(() => {
      expect(screen.getByTestId('item-1-cantidad')).toHaveTextContent('3')
      expect(screen.getByTestId('total')).toHaveTextContent('3000')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('3')
    })
  })

  it('debe eliminar un producto del carrito', async () => {
    const user = userEvent.setup()
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    // Agregar producto
    await user.click(screen.getByText('Agregar Producto'))

    await waitFor(() => {
      expect(screen.getByTestId('items-count')).toHaveTextContent('1')
    })

    // Eliminar producto
    await user.click(screen.getByText('Eliminar Producto'))

    await waitFor(() => {
      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
      expect(screen.getByTestId('total')).toHaveTextContent('0')
    })
  })

  it('debe vaciar el carrito completamente', async () => {
    const user = userEvent.setup()
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    // Agregar varios productos
    await user.click(screen.getByText('Agregar Producto'))
    await user.click(screen.getByText('Agregar Producto'))

    await waitFor(() => {
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('2')
    })

    // Vaciar carrito
    await user.click(screen.getByText('Vaciar Carrito'))

    await waitFor(() => {
      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
      expect(screen.getByTestId('total')).toHaveTextContent('0')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('0')
    })
  })

  it('debe persistir el carrito en localStorage', async () => {
    const user = userEvent.setup()
    
    const { unmount } = render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    // Agregar producto
    await user.click(screen.getByText('Agregar Producto'))

    await waitFor(() => {
      expect(screen.getByTestId('items-count')).toHaveTextContent('1')
    })

    // Verificar que se guardó en localStorage
    const storedCarrito = JSON.parse(localStorage.getItem('carrito') || '[]')
    expect(storedCarrito).toHaveLength(1)
    expect(storedCarrito[0].nombre).toBe('Producto Test')

    // Desmontar componente
    unmount()

    // Volver a montar y verificar que se cargó desde localStorage
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    )

    expect(screen.getByTestId('items-count')).toHaveTextContent('1')
    expect(screen.getByTestId('item-1-nombre')).toHaveTextContent('Producto Test')
  })
})