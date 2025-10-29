import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { createUser } from '../../services/api';

export function registerAdmin() {
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
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validateNombre = (nombre) => {
    if (!nombre) return 'El nombre es obligatorio';
    if (nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (nombre.length > 100) return 'El nombre no puede exceder 100 caracteres';
    return null;
  };

  const validateEmail = (email) => {
    if (!email) return 'El email es obligatorio';
    const emailRegex = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!emailRegex.test(email)) {
      return 'Email no válido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const newErrors = { ...errors };
    
    switch(name) {
      case 'nombre':
        const nombreError = validateNombre(value);
        if (nombreError) {
          newErrors.nombre = nombreError;
        } else {
          delete newErrors.nombre;
        }
        break;
        
      case 'email':
        const emailError = validateEmail(value);
        if (emailError) {
          newErrors.email = emailError;
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'contrasena':
        const passwordError = validatePassword(value);
        if (passwordError) {
          newErrors.contrasena = passwordError;
        } else {
          delete newErrors.contrasena;
        }
        
        // Validar confirmación de contraseña si ya existe
        if (formData.confirmarContrasena) {
          if (value !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
          } else {
            delete newErrors.confirmarContrasena;
          }
        }
        break;
        
      case 'confirmarContrasena':
        if (value !== formData.contrasena) {
          newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmarContrasena;
        }
        break;
    }
    
    setErrors(newErrors);
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    
    const nombreError = validateNombre(formData.nombre);
    if (nombreError) newErrors.nombre = nombreError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.contrasena);
    if (passwordError) newErrors.contrasena = passwordError;
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setGeneralError('');
    setSuccessMessage('');
    
    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        contrasena: formData.contrasena,
        rol: formData.rol,
        estado: formData.estado
      };
      
      await createUser(userData);
      
      setSuccessMessage('Usuario creado correctamente');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        contrasena: '',
        confirmarContrasena: '',
        rol: 'cliente',
        estado: 'activo'
      });
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        window.location.href = '/admin/usuarios';
      }, 2000);
      
    } catch (error) {
      setGeneralError(error.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Agregar Nuevo Usuario</h1>
            <a href="/admin/usuarios" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </a>
          </div>

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {successMessage}
            </div>
          )}

          {generalError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {generalError}
              <button type="button" className="btn-close" onClick={() => setGeneralError('')}></button>
            </div>
          )}

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">
                        Nombre Completo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : formData.nombre && !errors.nombre ? 'is-valid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ingrese nombre completo"
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                      {formData.nombre && !errors.nombre && (
                        <div className="valid-feedback">Nombre válido</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="usuario@duoc.cl"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                      {formData.email && !errors.email && (
                        <div className="valid-feedback">Email válido</div>
                      )}
                      <small className="text-muted">
                        Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com
                      </small>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="contrasena" className="form-label">
                          Contraseña <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.contrasena ? 'is-invalid' : formData.contrasena && !errors.contrasena ? 'is-valid' : ''}`}
                          id="contrasena"
                          name="contrasena"
                          value={formData.contrasena}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="••••••••"
                        />
                        {errors.contrasena && (
                          <div className="invalid-feedback">{errors.contrasena}</div>
                        )}
                        <small className="text-muted">
                          Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
                        </small>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmarContrasena" className="form-label">
                          Confirmar Contraseña <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : formData.confirmarContrasena && !errors.confirmarContrasena ? 'is-valid' : ''}`}
                          id="confirmarContrasena"
                          name="confirmarContrasena"
                          value={formData.confirmarContrasena}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="••••••••"
                        />
                        {errors.confirmarContrasena && (
                          <div className="invalid-feedback">{errors.confirmarContrasena}</div>
                        )}
                        {formData.confirmarContrasena && !errors.confirmarContrasena && (
                          <div className="valid-feedback">Las contraseñas coinciden</div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="rol" className="form-label">
                          Rol <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="rol"
                          name="rol"
                          value={formData.rol}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="cliente">Cliente</option>
                          <option value="vendedor">Vendedor</option>
                          <option value="super-admin">Super Administrador</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="estado" className="form-label">
                          Estado <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <a href="/admin/usuarios" className="btn btn-outline-secondary">
                        Cancelar
                      </a>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading || Object.keys(errors).length > 0}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Guardar Usuario
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}