// src/componentes/Productos/Productos.test.jsx
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { Productos } from './Productos'

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Productos.jsx', () => {
  const originalFetch = global.fetch
  const originalConfirm = window.confirm
  const originalAlert = window.alert

  beforeEach(() => {
    global.fetch = vi.fn()
    window.confirm = vi.fn().mockReturnValue(true)
    window.alert = vi.fn()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch
    window.confirm = originalConfirm
    window.alert = originalAlert
  })

  test('carga y muestra productos correctamente', async () => {
    const mockProductos = [
      { 
        id: 1, 
        nombre: 'Teclado', 
        descripcion: 'Mecánico', 
        precio: 19990, 
        stock: 10,
        estado: 'activo',
        imagen: null,
        categoria: { id: 1, nombre: 'Tecnología' }
      },
      { 
        id: 2, 
        nombre: 'Mouse', 
        descripcion: 'Óptico', 
        precio: 9990, 
        stock: 5,
        estado: 'activo',
        imagen: null,
        categoria: { id: 1, nombre: 'Tecnología' }
      }
    ]

    const mockCategorias = [
      { id: 1, nombre: 'Tecnología' }
    ]

    // Mock de productos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    // Mock de categorías
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategorias
    })

    renderWithRouter(<Productos />)

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Teclado')).toBeInTheDocument()
    })

    expect(screen.getByText('Mouse')).toBeInTheDocument()
    
    // Verificar que se muestran los precios usando getAllByText
    const precios = screen.getAllByText(/9\.990/)
    expect(precios.length).toBeGreaterThanOrEqual(2) // Al menos 2 precios con "9.990"

    // Verificar que muestra el título de la página
    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument()
    
    // Verificar que muestra el stock
    expect(screen.getByText(/Stock: 10/)).toBeInTheDocument()
    expect(screen.getByText(/Stock: 5/)).toBeInTheDocument()
  })

  test('elimina producto correctamente después de confirmación', async () => {
    const mockProductos = [
      { 
        id: 1, 
        nombre: 'Teclado', 
        descripcion: 'Mecánico', 
        precio: 19990,
        stock: 10,
        estado: 'activo',
        categoria: { id: 1, nombre: 'Tecnología' }
      }
    ]

    const mockCategorias = [{ id: 1, nombre: 'Tecnología' }]

    // Primera carga
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProductos })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategorias })
      .mockResolvedValueOnce({ ok: true }) // DELETE exitoso
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Recarga vacía

    renderWithRouter(<Productos />)

    await waitFor(() => {
      expect(screen.getByText('Teclado')).toBeInTheDocument()
    })

    const eliminarBtn = screen.getByRole('button', { name: /eliminar/i })
    const user = userEvent.setup()
    await user.click(eliminarBtn)

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Teclado'))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/productos/1',
        expect.objectContaining({ method: 'DELETE' })
      )
    })

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Producto eliminado exitosamente')
    })
  })

  test('no elimina producto si usuario cancela confirmación', async () => {
    window.confirm = vi.fn().mockReturnValue(false)
    
    const mockProductos = [
      { 
        id: 1, 
        nombre: 'Monitor', 
        descripcion: '24 pulgadas', 
        precio: 99900,
        stock: 3,
        estado: 'activo',
        categoria: { id: 1, nombre: 'Tecnología' }
      }
    ]
    
    const mockCategorias = [{ id: 1, nombre: 'Tecnología' }]

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProductos })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategorias })

    renderWithRouter(<Productos />)

    await waitFor(() => {
      expect(screen.getByText('Monitor')).toBeInTheDocument()
    })

    const eliminarBtn = screen.getByRole('button', { name: /eliminar/i })
    const user = userEvent.setup()
    await user.click(eliminarBtn)

    // Solo deben haberse llamado las 2 primeras (productos y categorías)
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(window.alert).not.toHaveBeenCalled()
  })

  test('muestra mensaje cuando no hay productos', async () => {
    const mockCategorias = [{ id: 1, nombre: 'Tecnología' }]

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategorias })

    renderWithRouter(<Productos />)

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument()
    })
  })

  test('permite buscar productos por nombre', async () => {
    const mockProductos = [
      { 
        id: 1, 
        nombre: 'Teclado Mecánico', 
        descripcion: 'RGB', 
        precio: 19990,
        stock: 10,
        estado: 'activo',
        categoria: { id: 1, nombre: 'Tecnología' }
      },
      { 
        id: 2, 
        nombre: 'Mouse Gamer', 
        descripcion: 'Óptico', 
        precio: 9990,
        stock: 5,
        estado: 'activo',
        categoria: { id: 1, nombre: 'Tecnología' }
      }
    ]

    const mockCategorias = [{ id: 1, nombre: 'Tecnología' }]

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProductos })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategorias })

    renderWithRouter(<Productos />)

    await waitFor(() => {
      expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument()
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
    })

    // Buscar por "teclado"
    const searchInput = screen.getByPlaceholderText(/buscar producto/i)
    const user = userEvent.setup()
    await user.type(searchInput, 'teclado')

    await waitFor(() => {
      expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument()
      expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument()
    })

    // Verificar contador de resultados
    expect(screen.getByText(/1 producto encontrado/i)).toBeInTheDocument()
  })
})