<<<<<<< HEAD
// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function Login() {
  const { login } = useAuth();
=======
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, isAuthenticated } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  
>>>>>>> origin/main
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
<<<<<<< HEAD
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const newErrors = { ...errors };
    
    if (name === 'email') {
      if (!value) {
        newErrors.email = 'El email es obligatorio';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Email no válido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com';
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === 'password') {
      if (!value) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (!validatePassword(value)) {
        newErrors.password = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número';
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
    setGeneralError('');
=======
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
>>>>>>> origin/main
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    // Validar todos los campos antes de enviar
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Contraseña no cumple con los requisitos';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
=======
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos');
>>>>>>> origin/main
      return;
    }
    
    setLoading(true);
<<<<<<< HEAD
    setGeneralError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redireccionar según el rol
        if (result.user.rol === 'super-admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setGeneralError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setGeneralError('Error de conexión. Verifica que el backend esté ejecutándose.');
=======
    
    try {
      await loginUser(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Por favor intente nuevamente.');
      console.error('Error en login:', err);
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <>
      <Navbar />
      
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
                  <h3 className="mt-2">Iniciar Sesión</h3>
                  <p className="text-muted">Accede a tu cuenta de Kkarhua</p>
                </div>

                {generalError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {generalError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
=======
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-shop text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="mt-3 mb-2 fw-bold">Tienda Virtual</h2>
                  <p className="text-muted">Panel de Administración</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-1"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
>>>>>>> origin/main
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
<<<<<<< HEAD
                      placeholder="ejemplo@duoc.cl"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                    {formData.email && !errors.email && (
                      <div className="valid-feedback">
                        Email válido
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
=======
                      placeholder="correo@ejemplo.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-1"></i>
>>>>>>> origin/main
                      Contraseña
                    </label>
                    <input
                      type="password"
<<<<<<< HEAD
                      className={`form-control ${errors.password ? 'is-invalid' : formData.password && !errors.password ? 'is-valid' : ''}`}
=======
                      className="form-control"
>>>>>>> origin/main
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
<<<<<<< HEAD
                      disabled={loading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    )}
                    {formData.password && !errors.password && (
                      <div className="valid-feedback">
                        Contraseña válida
                      </div>
                    )}
                    <small className="text-muted">
                      Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                    </small>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading || Object.keys(errors).length > 0}
=======
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
>>>>>>> origin/main
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
<<<<<<< HEAD

                <div className="text-center">
                  <p className="text-muted mb-0">
                    ¿No tienes cuenta? 
                    <a href="/register" className="text-decoration-none ms-1">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Tus datos están protegidos
              </small>
=======
              </div>
            </div>
            
            <div className="text-center mt-3">
              <small className="text-muted">© 2025 Tienda Virtual. Todos los derechos reservados.</small>
>>>>>>> origin/main
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      
      <Footer />
    </>
  );
}
=======
    </div>
  );
};

export default Login;
>>>>>>> origin/main
