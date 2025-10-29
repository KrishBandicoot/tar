import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    correoConfirm: '',
    password: '',
    passwordConfirm: '',
    telefono: '',
    comuna: '0'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.correo !== formData.correoConfirm) {
      alert('Los correos no coinciden');
      return;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push({
      id: Date.now(),
      ...formData,
      tipoUsuario: 'Cliente'
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Usuario registrado correctamente');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      
      <div className="row justify-content-center" style={{ marginTop: '25px' }}>
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="formulario-fondo p-4 rounded">
            <h3 className="titulo2" style={{ textAlign: 'center', marginBottom: '20px' }}>
              Registro de usuario
            </h3>
            
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="nom" className="form-label etiqueta">Nombre completo:</label>
              <input type="text" className="form-control" id="nom" placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="correo" className="form-label etiqueta">Correo electrónico:</label>
              <input type="text" className="form-control" id="correo" placeholder="Correo"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})} />
            </div>
            
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="correoConfirm" className="form-label etiqueta">Confirmar correo:</label>
              <input type="text" className="form-control" id="correoConfirm" placeholder="Repite tu correo"
                value={formData.correoConfirm}
                onChange={(e) => setFormData({...formData, correoConfirm: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="pass" className="form-label etiqueta">Contraseña:</label>
              <input type="password" className="form-control" id="pass" placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="passConfirm" className="form-label etiqueta">Confirmar Contraseña:</label>
              <input type="password" className="form-control" id="passConfirm" placeholder="Repite tu contraseña"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})} />
            </div>
            
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="tel" className="form-label etiqueta">Teléfono (Opcional):</label>
              <input type="text" className="form-control" id="tel" placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label htmlFor="comuna">Comuna: </label>
              <select name="comuna" id="comuna" required
                value={formData.comuna}
                onChange={(e) => setFormData({...formData, comuna: e.target.value})}>
                <option value="0">Seleccione comuna</option>
                <option value="1">Cerrillos</option>
                <option value="2">Cerro Navia</option>
                <option value="3">Conchalí</option>
                {/* Resto de comunas */}
              </select>
            </div>
            
            <div className="text-center mt-4" style={{ marginBottom: '5px' }}>
              <input type="submit" value="Registrar" className="btn btn-outline-success me-2" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};