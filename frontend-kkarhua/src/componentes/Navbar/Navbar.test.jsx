import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './Navbar'

describe('Navbar', () => {
 
  it('muestra la marca y los links con sus href correctos', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const brand = screen.getByRole('link', { name: /mi página/i })
    expect(brand).toBeInTheDocument()
    expect(brand).toHaveAttribute('href', '/')
  
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /inventario/i })).toHaveAttribute('href', '/inventario')
    expect(screen.getByRole('link', { name: /contacto/i })).toHaveAttribute('href', '/contacto')
  
    const toggler = screen.getByRole('button')
    expect(toggler).toHaveAttribute('data-bs-toggle', 'collapse')
    expect(toggler).toHaveAttribute('data-bs-target', '#menuNav')
  })

  
  it('navega a /inventario al hacer click en el link', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/inventario" element={<h1>Inventario</h1>} />
          <Route path="/contacto" element={<h1>Contacto</h1>} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: /inventario/i }))
 
    expect(await screen.findByRole('heading', { name: /inventario/i })).toBeInTheDocument()
  })
})
