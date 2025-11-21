// src/componentes/Footer/Footer.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './Footer'

describe('Footer', () => {
  it('debe renderizar el nombre de la empresa', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Kkarhua')).toBeInTheDocument()
  })

  it('debe renderizar la descripción de la empresa', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/Tu tienda online de confianza para joyería y accesorios de moda/i)
    ).toBeInTheDocument()
  })

  it('debe tener enlaces a las páginas principales', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    // Verificar que existen los enlaces
    const homeLink = screen.getByRole('link', { name: /home/i })
    const productosLink = screen.getByRole('link', { name: /productos/i })
    const contactoLink = screen.getByRole('link', { name: /contacto/i })

    expect(homeLink).toBeInTheDocument()
    expect(productosLink).toBeInTheDocument()
    expect(contactoLink).toBeInTheDocument()

    // Verificar las rutas
    expect(homeLink).toHaveAttribute('href', '/')
    expect(productosLink).toHaveAttribute('href', '/lista-productos')
    expect(contactoLink).toHaveAttribute('href', '/contacto')
  })

  it('debe mostrar iconos de redes sociales', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    // Buscar enlaces de redes sociales
    const socialLinks = screen.getAllByRole('link').filter(link => 
      link.querySelector('i.bi-facebook') || 
      link.querySelector('i.bi-instagram') || 
      link.querySelector('i.bi-twitter')
    )

    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('debe mostrar el año actual en el copyright', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(
      new RegExp(`© ${currentYear} Kkarhua.*Todos los derechos reservados`, 'i')
    )

    expect(copyrightText).toBeInTheDocument()
  })

  it('debe tener la estructura de Bootstrap correcta', () => {
    const { container } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    // Verificar que tiene clases de Bootstrap
    expect(container.querySelector('.footer-component')).toBeInTheDocument()
    expect(container.querySelector('.bg-dark')).toBeInTheDocument()
    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('.row')).toBeInTheDocument()
  })

  it('debe ser responsivo con columnas Bootstrap', () => {
    const { container } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    // Verificar que tiene columnas responsivas
    const columns = container.querySelectorAll('[class*="col-md"]')
    expect(columns.length).toBeGreaterThan(0)
  })

  it('debe tener el título "Enlaces Rápidos"', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument()
  })

  it('debe tener el título "Síguenos"', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Síguenos')).toBeInTheDocument()
  })

  it('los enlaces de redes sociales deben tener el href="#"', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    const allLinks = screen.getAllByRole('link')
    const socialLinks = allLinks.filter(link => 
      link.querySelector('i.bi-facebook') || 
      link.querySelector('i.bi-instagram') || 
      link.querySelector('i.bi-twitter')
    )

    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#')
    })
  })
})