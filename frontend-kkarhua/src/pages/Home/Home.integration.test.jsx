// src/pages/Home/Home.integration.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './Home'
import { AuthProvider } from '../../context/AuthContext'
import { CarritoProvider } from '../../context/CarritoContext'

// Mock de fetch global
global.fetch = vi.fn()
global.alert = vi.fn()

const mockProductos = [
  {
    id: 1,
    nombre: 'Collar de Plata',
    descripcion: 'Hermoso collar de plata con diseño elegante',
    precio: 15000,
    stock: 10,
    estado: 'activo',
    imagen: 'collar1.jpg',
    categoria: { id: 1, nombre: 'Collares' }
  },
  {
    id: 2,
    nombre: 'Anillo de Oro',
    descripcion: 'Anillo de oro de 18 quilates',
    precio: 25000,
    stock: 5,
    estado: 'activo',
    imagen: 'anillo1.jpg',
    categoria: { id: 2, nombre: 'Anillos' }
  },
  {
    id: 3,
    nombre: 'Pulsera de Plata',
    descripcion: 'Pulsera elegante de plata con detalles',
    precio: 12000,
    stock: 0,
    estado: 'inactivo',
    imagen: null,
    categoria: { id: 3, nombre: 'Pulseras' }
  }
]

describe('Home - Integración completa', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe cargar y mostrar productos correctamente', async () => {
    // Mock de la respuesta del API
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Verificar que muestra el indicador de carga específico
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument()

    // Esperar a que se carguen los productos
    await waitFor(() => {
      expect(screen.getByText('Collar de Plata')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar que se muestran solo los productos activos (máximo 8)
    expect(screen.getByText('Collar de Plata')).toBeInTheDocument()
    expect(screen.getByText('Anillo de Oro')).toBeInTheDocument()
    
    // El producto inactivo NO debe mostrarse
    expect(screen.queryByText('Pulsera de Plata')).not.toBeInTheDocument()

    // Verificar que se llamó al API correctamente
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/productos')
  })

  it('debe mostrar mensaje de error si falla la carga de productos', async () => {
    // Mock de error en el API
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Debe mostrar el botón de reintentar
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
  })

  it('debe permitir reintentar la carga de productos', async () => {
    const user = userEvent.setup()

    // Primera llamada falla
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Segunda llamada exitosa
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    const reintentarBtn = screen.getByRole('button', { name: /reintentar/i })
    await user.click(reintentarBtn)

    await waitFor(() => {
      expect(screen.getByText('Collar de Plata')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe mostrar los precios formateados correctamente', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      // Verificar formato de precio chileno (con puntos como separador de miles)
      expect(screen.getByText(/\$15\.000/)).toBeInTheDocument()
      expect(screen.getByText(/\$25\.000/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe mostrar enlaces de autenticación cuando no hay usuario', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
    expect(screen.getByText(/registrar/i)).toBeInTheDocument()
  })

  it('debe mostrar información del usuario cuando está autenticado', async () => {
    // Simular usuario autenticado en localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        rol: 'cliente'
      })
    )
    localStorage.setItem('accessToken', 'mock-token')

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      // Buscar el texto específico que aparece solo en el auth-links
      expect(screen.getByText(/bienvenido,/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe mostrar el botón de admin solo para super-admin', async () => {
    // Usuario super-admin
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        nombre: 'Admin User',
        email: 'admin@test.com',
        rol: 'super-admin'
      })
    )
    localStorage.setItem('accessToken', 'mock-token')

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductos
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/panel admin/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('debe truncar descripciones largas correctamente', async () => {
    const productoConDescripcionLarga = {
      ...mockProductos[0],
      descripcion:
        'Esta es una descripción muy larga que debería ser truncada después de 80 caracteres para mantener la interfaz limpia y legible'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [productoConDescripcionLarga]
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      const descripcion = screen.getByText(/Esta es una descripción muy larga/)
      expect(descripcion.textContent).toMatch(/\.{3}$/) // Termina con "..."
      expect(descripcion.textContent.length).toBeLessThanOrEqual(83) // 80 + "..."
    }, { timeout: 3000 })
  })

  it('debe manejar productos sin imagen correctamente', async () => {
    // Crear un producto activo pero sin imagen (el mock original tiene estado inactivo)
    const productoSinImagen = {
      ...mockProductos[2],
      estado: 'activo' // Cambiamos a activo para que se muestre
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [productoSinImagen]
    })

    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Home />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      // Esperar a que se cargue el producto
      expect(screen.getByText('Pulsera de Plata')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar que hay imágenes en el DOM
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
    
    // Buscar la imagen del producto (excluyendo las del hero y footer)
    const productImages = Array.from(images).filter(img => 
      img.alt === 'Pulsera de Plata'
    )
    
    // Debe existir al menos una imagen del producto
    expect(productImages.length).toBeGreaterThan(0)
    
    // La imagen debe usar placeholder (porque el producto tiene imagen: null)
    const productImage = productImages[0]
    expect(productImage.src).toMatch(/placeholder/)
  })
})