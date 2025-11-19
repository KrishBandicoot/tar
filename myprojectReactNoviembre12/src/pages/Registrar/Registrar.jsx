import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../componentes/Navbar/Navbar';
import { Footer } from '../../componentes/Footer/Footer';
import './Registrar.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Registrar() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validación de requisitos de contraseña
  const passwordRequirements = {
    minLength: formData.contrasena.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.contrasena),
    hasLowercase: /[a-z]/.test(formData.contrasena),
    hasNumber: /[0-9]/.test(formData.contrasena)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Validar contraseña
    if (!isPasswordValid) {
      newErrors.contrasena = 'La contraseña no cumple con los requisitos';
    }

    // Validar confirmación de contraseña
    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Enviar datos al endpoint con autoLogin=true
      const response = await fetch(`${API_BASE_URL}/usuarios?autoLogin=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          contrasena: formData.contrasena,
          rol: 'cliente' 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos del backend
        if (data.error) {
          throw new Error(data.error);
        }
        // Manejar errores de validación de campos
        if (typeof data === 'object' && !data.error) {
          setErrors(data);
          throw new Error('Por favor corrige los errores en el formulario');
        }
        throw new Error('Error al registrar usuario');
      }

      // Usar el método login del contexto
      login(data.user, data.accessToken, data.refreshToken);

      // Mostrar mensaje de éxito
      alert('¡Cuenta creada exitosamente! Bienvenido a Kkarhua');

      // Verificar si había una compra pendiente
      const intendedPurchase = localStorage.getItem('intendedPurchase');
      if (intendedPurchase) {
        localStorage.removeItem('intendedPurchase');
        navigate('/carrito');
      } else {
        navigate(redirectTo);
      }

    } catch (err) {
      setErrors({ general: err.message || 'Error al crear la cuenta. Intenta nuevamente.' });
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
              <h2>Crear Cuenta</h2>
              <p className="text-muted">Únete a la comunidad de Kkarhua</p>
            </div>

            {redirectTo === '/carrito' && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Crea una cuenta para continuar con tu compra
              </div>
            )}

            {errors.general && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Nombre completo */}
              <div className="form-group">
                <label htmlFor="nombre">
                  <i className="bi bi-person me-2"></i>
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="name"
                />
                {errors.nombre && (
                  <div className="invalid-feedback d-block">
                    {errors.nombre}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  <i className="bi bi-envelope me-2"></i>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label htmlFor="contrasena">
                  <i className="bi bi-lock me-2"></i>
                  Contraseña
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contrasena"
                    name="contrasena"
                    className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="new-password"
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
                
                {/* Requisitos de contraseña */}
                {formData.contrasena && (
                  <div className="password-requirements">
                    <small className={passwordRequirements.minLength ? 'text-success' : 'text-muted'}>
                      <i className={`bi ${passwordRequirements.minLength ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                      Mínimo 8 caracteres
                    </small>
                    <small className={passwordRequirements.hasUppercase ? 'text-success' : 'text-muted'}>
                      <i className={`bi ${passwordRequirements.hasUppercase ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                      Una letra mayúscula
                    </small>
                    <small className={passwordRequirements.hasLowercase ? 'text-success' : 'text-muted'}>
                      <i className={`bi ${passwordRequirements.hasLowercase ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                      Una letra minúscula
                    </small>
                    <small className={passwordRequirements.hasNumber ? 'text-success' : 'text-muted'}>
                      <i className={`bi ${passwordRequirements.hasNumber ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                      Un número
                    </small>
                  </div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="form-group">
                <label htmlFor="confirmarContrasena">
                  <i className="bi bi-shield-check me-2"></i>
                  Confirmar contraseña
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.confirmarContrasena && (
                  <div className="invalid-feedback d-block">
                    {errors.confirmarContrasena}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Crear Cuenta
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <div className="divider">
                <span>O</span>
              </div>
              
              <p className="text-center mb-0">
                ¿Ya tienes una cuenta? {' '}
                <Link to={`/IniciarSesion?redirect=${redirectTo}`} className="auth-link">
                  Inicia sesión aquí
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