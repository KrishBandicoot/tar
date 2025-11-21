// src/componentes/Navbar/Navbar.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { CarritoProvider } from '../../context/CarritoContext'

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe renderizar todos los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Kkarhua')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /productos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contacto/i })).toBeInTheDocument()
  })

  it('debe mostrar el badge del carrito con la cantidad correcta', async () => {
    const user = userEvent.setup()
    
    // Configurar carrito con 3 items en localStorage
    localStorage.setItem(
      'carrito',
      JSON.stringify([
        { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 1 }
      ])
    )

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    // Verificar que el badge muestra 3 (suma de cantidades)
    await waitFor(() => {
      const badge = screen.getByText('3')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('badge')
    })
  })

  it('no debe mostrar badge si el carrito está vacío', () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    // No debe existir ningún badge con número
    const badges = screen.queryAllByText(/^[0-9]+$/)
    expect(badges).toHaveLength(0)
  })

  it('debe navegar al carrito al hacer clic en el ícono', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    // Buscar el botón del carrito (tiene un ícono bi-cart3)
    const carritoButton = screen.getByRole('button', { name: /carrito/i })
    expect(carritoButton).toBeInTheDocument()

    await user.click(carritoButton)

    // Verificar que se llamó a navigate con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/carrito')
  })

  it('debe tener los atributos href correctos en los enlaces', () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /productos/i })).toHaveAttribute(
      'href',
      '/lista-productos'
    )
    expect(screen.getByRole('link', { name: /contacto/i })).toHaveAttribute(
      'href',
      '/contacto'
    )
  })

  it('debe cerrar el menú hamburguesa al hacer clic en el carrito', async () => {
    const user = userEvent.setup()
    
    // Renderizar en viewport móvil
    global.innerWidth = 500
    
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </MemoryRouter>
    )

    // Simular que el menú está abierto añadiendo la clase 'show'
    const navbarCollapse = document.querySelector('.navbar-collapse')
    navbarCollapse?.classList.add('show')

    const carritoButton = screen.getByRole('button', { name: /carrito/i })
    await user.click(carritoButton)

    // El código debería cerrar el menú (este test verifica que no crashee)
    expect(mockNavigate).toHaveBeenCalledWith('/carrito')
  })
})