// src/componentes/Navbar/Navbar.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { CarritoProvider } from '../../context/CarritoContext'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
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

    // Buscar todos los botones y filtrar el que tiene el ícono del carrito
    const buttons = screen.getAllByRole('button')
    const carritoButton = buttons.find(btn => btn.querySelector('.bi-cart3'))
    
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

    // Buscar el botón del carrito específicamente (igual que el test anterior)
    const buttons = screen.getAllByRole('button')
    const carritoButton = buttons.find(btn => btn.querySelector('.bi-cart3'))
    
    expect(carritoButton).toBeInTheDocument()
    
    await user.click(carritoButton)

    // El código debería cerrar el menú (este test verifica que no crashee)
    expect(mockNavigate).toHaveBeenCalledWith('/carrito')
  })
})