// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    emailConfirm: '',
    contrasena: '',
    contrasenaConfirm: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const newErrors = { ...errors };
    
    if (name === 'nombre') {
      if (!value) {
        newErrors.nombre = 'El nombre es obligatorio';
      } else if (value.length < 3) {
        newErrors.nombre = 'Mínimo 3 caracteres';
      } else if (value.length > 100) {
        newErrors.nombre = 'Máximo 100 caracteres';
      } else {
        delete newErrors.nombre;
      }
    }
    
    if (name === 'email') {
      if (!value) {
        newErrors.email = 'El email es obligatorio';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Email no válido';
      } else {
        delete newErrors.email;
      }
      
      if (formData.emailConfirm && value !== formData.emailConfirm) {
        newErrors.emailConfirm = 'Los emails no coinciden';
      } else if (formData.emailConfirm) {
        delete newErrors.emailConfirm;
      }
    }
    
    if (name === 'emailConfirm') {
      if (value !== formData.email) {
        newErrors.emailConfirm = 'Los emails no coinciden';
      } else {
        delete newErrors.emailConfirm;
      }
    }
    
    if (name === 'contrasena') {
      if (!value) {
        newErrors.contrasena = 'La contraseña es obligatoria';
      } else if (!validatePassword(value)) {
        newErrors.contrasena = 'Mínimo 8 caracteres, una mayúscula, minúscula y número';
      } else {
        delete newErrors.contrasena;
      }
      
      if (formData.contrasenaConfirm && value !== formData.contrasenaConfirm) {
        newErrors.contrasenaConfirm = 'Las contraseñas no coinciden';
      } else if (formData.contrasenaConfirm) {
        delete newErrors.contrasenaConfirm;
      }
    }
    
    if (name === 'contrasenaConfirm') {
      if (value !== formData.contrasena) {
        newErrors.contrasenaConfirm = 'Las contraseñas no coinciden';
      } else {
        delete newErrors.contrasenaConfirm;
      }
    }
    
    setErrors(newErrors);
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = 'Nombre inválido';
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (formData.email !== formData.emailConfirm) {
      newErrors.emailConfirm = 'Los emails no coinciden';
    }
    
    if (!formData.contrasena || !validatePassword(formData.contrasena)) {
      newErrors.contrasena = 'Contraseña inválida';
    }
    
    if (formData.contrasena !== formData.contrasenaConfirm) {
      newErrors.contrasenaConfirm = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setGeneralError('');
    
    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        contrasena: formData.contrasena,
        rol: 'cliente', // Rol por defecto
        estado: 'activo'
      };
      
      await createUser(userData);
      
      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      setGeneralError(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus-fill" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
                  <h3 className="mt-2">Registro de Usuario</h3>
                  <p className="text-muted">Crea tu cuenta en Kkarhua</p>
                </div>

                {generalError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {generalError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : formData.nombre && !errors.nombre ? 'is-valid' : ''}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      disabled={loading}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@duoc.cl"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="emailConfirm" className="form-label">
                      <i className="bi bi-envelope-check me-2"></i>
                      Confirmar correo
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.emailConfirm ? 'is-invalid' : formData.emailConfirm && !errors.emailConfirm ? 'is-valid' : ''}`}
                      id="emailConfirm"
                      name="emailConfirm"
                      value={formData.emailConfirm}
                      onChange={handleChange}
                      placeholder="Repite tu correo"
                      disabled={loading}
                    />
                    {errors.emailConfirm && (
                      <div className="invalid-feedback">{errors.emailConfirm}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.contrasena ? 'is-invalid' : formData.contrasena && !errors.contrasena ? 'is-valid' : ''}`}
                      id="contrasena"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    {errors.contrasena && (
                      <div className="invalid-feedback">{errors.contrasena}</div>
                    )}
                    <small className="text-muted">
                      Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contrasenaConfirm" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.contrasenaConfirm ? 'is-invalid' : formData.contrasenaConfirm && !errors.contrasenaConfirm ? 'is-valid' : ''}`}
                      id="contrasenaConfirm"
                      name="contrasenaConfirm"
                      value={formData.contrasenaConfirm}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      disabled={loading}
                    />
                    {errors.contrasenaConfirm && (
                      <div className="invalid-feedback">{errors.contrasenaConfirm}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading || Object.keys(errors).length > 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Registrar
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta? 
                    <a href="/login" className="text-decoration-none ms-1">
                      Inicia sesión aquí
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}