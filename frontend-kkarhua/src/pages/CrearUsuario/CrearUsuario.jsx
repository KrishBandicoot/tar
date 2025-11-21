import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './CrearUsuario.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function CrearUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: 'cliente',
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const menuItems = [
    { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
    { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
    { icon: 'bi-plus-circle', label: 'Crear Producto', path: '/crear-producto' },
    { icon: 'bi-people', label: 'Usuarios', path: '/usuarios' },
    { icon: 'bi-person-plus', label: 'Crear Usuario', path: '/crear-usuario' },
    { icon: 'bi-tag', label: 'Categorías', path: '/categorias' },
    { icon: 'bi-truck', label: 'Envíos', path: '/envios'},
    { icon: 'bi-cart-check', label: 'Compras', path: '/compras'},
    { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
    { icon: 'bi-house', label: 'Inicio', path: '/' }
  ];

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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!isPasswordValid) {
      newErrors.contrasena = 'La contraseña no cumple con los requisitos';
    }

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
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          contrasena: formData.contrasena,
          rol: formData.rol,
          estado: formData.estado
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (typeof data === 'object' && !data.error) {
          setErrors(data);
          throw new Error('Por favor corrige los errores en el formulario');
        }
        
        throw new Error('Error al crear usuario');
      }

      alert('✅ Usuario creado exitosamente');
      navigate('/usuarios');

    } catch (err) {
      console.error('❌ Error en creación de usuario:', err);
      setErrors({ 
        general: err.message || 'Error al crear el usuario. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const tieneContenido = Object.values(formData).some(val => 
      val !== '' && val !== 'cliente' && val !== 'activo'
    );

    if (!tieneContenido || window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
      navigate('/usuarios');
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-wrapper">
        <Sidebar menuItems={menuItems} currentPath="/crear-usuario" />

        <main className="admin-main">
          <div className="crear-usuario-container">
            <div className="form-card">
              <h2>Crear Nuevo Usuario</h2>
              <p className="subtitle">Registra un nuevo usuario en el sistema</p>

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
                    Nombre completo <span className="required">*</span>
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
                    maxLength={100}
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
                    Correo electrónico <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="usuario@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
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
                    Contraseña <span className="required">*</span>
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
                  
                  {errors.contrasena && (
                    <div className="invalid-feedback d-block">
                      {errors.contrasena}
                    </div>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="form-group">
                  <label htmlFor="confirmarContrasena">
                    <i className="bi bi-shield-check me-2"></i>
                    Confirmar contraseña <span className="required">*</span>
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

                {/* Fila: Rol y Estado */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rol">
                      <i className="bi bi-person-badge me-2"></i>
                      Rol <span className="required">*</span>
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="form-control"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="estado">
                      <i className="bi bi-toggle-on me-2"></i>
                      Estado <span className="required">*</span>
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="form-control"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creando usuario...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Crear Usuario
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    disabled={loading} 
                    className="btn-secondary"
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}