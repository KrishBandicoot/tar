// src/pages/IniciarSesion/IniciarSesion.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { Footer } from '../../componentes/Footer/Footer';
import './IniciarSesion.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function IniciarSesion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Verificar si había una compra pendiente
      const intendedPurchase = localStorage.getItem('intendedPurchase');
      if (intendedPurchase) {
        localStorage.removeItem('intendedPurchase');
        navigate('/carrito');
      } else {
        // Redirigir según rol
        if (data.user.rol === 'super-admin') {
          navigate('/productos'); // Panel admin
        } else if (data.user.rol === 'vendedor') {
          navigate('/productos'); // Panel vendedor
        } else {
          navigate(redirectTo); // Cliente va a donde venía
        }
      }

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="auth-container">
        <div className="container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Iniciar Sesión</h2>
              <p className="text-muted">Accede a tu cuenta de Kkarhua</p>
            </div>

            {redirectTo === '/carrito' && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Debes iniciar sesión para continuar con tu compra
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <i className="bi bi-envelope me-2"></i>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <i className="bi bi-lock me-2"></i>
                  Contraseña
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <div className="divider">
                <span>O</span>
              </div>
              
              <p className="text-center mb-0">
                ¿No tienes una cuenta? {' '}
                <Link to={`/Registrar?redirect=${redirectTo}`} className="auth-link">
                  Regístrate aquí
                </Link>
              </p>

              <p className="text-center mt-3 mb-0">
                <Link to="/" className="text-muted small">
                  <i className="bi bi-arrow-left me-1"></i>
                  Volver al inicio
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}