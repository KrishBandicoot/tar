// src/context/AuthContext.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

// Componente de prueba
function TestComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated() ? 'Autenticado' : 'No autenticado'}
      </div>
      
      {user && (
        <>
          <div data-testid="user-name">{user.nombre}</div>
          <div data-testid="user-email">{user.email}</div>
          <div data-testid="user-rol">{user.rol}</div>
        </>
      )}

      <button
        onClick={() =>
          login(
            {
              id: 1,
              nombre: 'Juan Pérez',
              email: 'juan@test.com',
              rol: 'cliente'
            },
            'mock-access-token',
            'mock-refresh-token'
          )
        }
      >
        Login
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe iniciar con usuario no autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('No autenticado')
  })

  it('debe autenticar un usuario correctamente', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Hacer login
    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Juan Pérez')
      expect(screen.getByTestId('user-email')).toHaveTextContent('juan@test.com')
      expect(screen.getByTestId('user-rol')).toHaveTextContent('cliente')
    })

    // Verificar que se guardó en localStorage
    expect(localStorage.getItem('user')).toBeTruthy()
    expect(localStorage.getItem('accessToken')).toBe('mock-access-token')
    expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token')
  })

  it('debe cerrar sesión correctamente', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Primero hacer login
    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado')
    })

    // Hacer logout
    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('No autenticado')
    })

    // Verificar que se limpió localStorage
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })

  it('debe persistir la sesión del usuario', async () => {
    const user = userEvent.setup()

    // Primera renderización: hacer login
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado')
    })

    // Desmontar componente
    unmount()

    // Segunda renderización: verificar que se mantiene la sesión
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Juan Pérez')
    })
  })

  it('debe manejar datos corruptos en localStorage', () => {
    // Simular datos corruptos
    localStorage.setItem('user', 'datos-invalidos-{')
    localStorage.setItem('accessToken', 'token-valido')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Debe mostrar como no autenticado y limpiar localStorage
    expect(screen.getByTestId('auth-status')).toHaveTextContent('No autenticado')
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
  })
})