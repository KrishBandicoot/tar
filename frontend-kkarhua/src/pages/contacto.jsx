import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Contacto = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío de formulario
    alert('Mensaje enviado correctamente');
  };

  return (
    <>
      <Navbar />
      
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#222' }}>Kkarhua</h1>
      </div>

      <div className="row justify-content-center" style={{ marginTop: '25px' }}>
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="formulario-fondo p-4 rounded">
            <h3 className="titulo2" style={{ textAlign: 'center', marginBottom: '20px' }}>
              Formulario de Contacto
            </h3>
            
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="nom" className="form-label etiqueta">Nombre completo:</label>
              <input type="text" className="form-control" id="nom" placeholder="Nombre"
                required maxLength="100" />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="correo" className="form-label etiqueta">Correo electrónico:</label>
              <input type="text" className="form-control" id="correo" placeholder="Correo"
                required maxLength="100"
                pattern="^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                title="Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com" />
              <span id="mensajeCorreo"></span>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="contenido" className="form-label etiqueta">Comentario</label>
              <textarea className="form-control" id="contenido" rows="3"
                required maxLength="500"></textarea>
            </div>
            
            <div className="text-center mt-4" style={{ marginBottom: '5px' }}>
              <input type="submit" value="ENVIAR MENSAJE" className="btn btn-outline-success me-2" 
                style={{ padding: '10px 40px' }} />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};