// src/componentes/Boleta/Boleta.jsx
import { useEffect, useState } from 'react';
import './Boleta.css';

export function Boleta() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    const cargarDatos = () => {
      console.log('🔍 Intento', intentos + 1, '- Buscando datos de boleta...');
      
      // Intentar recuperar datos de localStorage
      const datosGuardados = localStorage.getItem('datosBoleta');
      
      if (datosGuardados) {
        try {
          const datosParsed = JSON.parse(datosGuardados);
          console.log('✅ Datos encontrados y parseados correctamente');
          setDatos(datosParsed);
          setLoading(false);
          
          // Limpiar localStorage después de cargar
          localStorage.removeItem('datosBoleta');
          console.log('🧹 Datos limpiados de localStorage');
        } catch (error) {
          console.error('❌ Error al parsear datos:', error);
          setLoading(false);
        }
      } else {
        // Si no hay datos, reintentar hasta 5 veces con delay
        if (intentos < 5) {
          console.log('⏳ No hay datos aún, reintentando...');
          setTimeout(() => {
            setIntentos(prev => prev + 1);
          }, 300);
        } else {
          console.error('❌ No se encontraron datos después de 5 intentos');
          setLoading(false);
        }
      }
    };

    cargarDatos();
  }, [intentos]);

  if (loading) {
    return (
      <div className="boleta-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{
            width: '3rem',
            height: '3rem',
            borderWidth: '0.3em'
          }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p style={{ marginTop: '20px', color: '#6c757d' }}>Cargando boleta...</p>
        </div>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="boleta-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '20px'
      }}>
        <div className="alert alert-danger" style={{ 
          maxWidth: '500px', 
          textAlign: 'center',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <i className="bi bi-exclamation-triangle" style={{ 
            fontSize: '48px', 
            marginBottom: '15px',
            display: 'block',
            color: '#dc3545'
          }}></i>
          <h4 style={{ marginBottom: '15px' }}>Error al cargar la boleta</h4>
          <p style={{ marginBottom: '20px' }}>
            No se encontraron datos de la compra. Por favor regresa al carrito y vuelve a intentar.
          </p>
          <button 
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '6px',
              border: 'none',
              background: '#0d6efd',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => window.close()}
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    );
  }

  const { datosCliente, datosEnvio, items, preciosDesglose } = datos;
  
  const fechaActual = new Date().toLocaleString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const numeroBoleta = `BOL-${Date.now()}`;

  return (
    <div className="boleta-container">
      <div className="boleta">
        {/* HEADER */}
        <div className="boleta-header">
          <h1>🛍️ KKARHUA</h1>
          <p>Boleta de Compra Electrónica</p>
          <p><strong>N°: {numeroBoleta}</strong></p>
          <p>Fecha: {fechaActual}</p>
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}
        <div className="boleta-section">
          <h2>📋 Información del Cliente</h2>
          <div className="info-row">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{datosCliente.nombre} {datosCliente.apellidos}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Correo:</span>
            <span className="info-value">{datosCliente.correo}</span>
          </div>
        </div>

        {/* DIRECCIÓN DE ENVÍO */}
        <div className="boleta-section">
          <h2>📦 Dirección de Envío</h2>
          <div className="info-row">
            <span className="info-label">Calle:</span>
            <span className="info-value">{datosEnvio.calle}</span>
          </div>
          {datosEnvio.departamento && (
            <div className="info-row">
              <span className="info-label">Departamento:</span>
              <span className="info-value">{datosEnvio.departamento}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">Comuna:</span>
            <span className="info-value">{datosEnvio.comuna}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Región:</span>
            <span className="info-value">{datosEnvio.region}</span>
          </div>
          {datosEnvio.indicaciones && (
            <div className="info-row">
              <span className="info-label">Indicaciones:</span>
              <span className="info-value">{datosEnvio.indicaciones}</span>
            </div>
          )}
        </div>

        {/* DETALLE DE LA COMPRA */}
        <div className="boleta-section">
          <h2>🛒 Detalle de la Compra</h2>
          <table className="boleta-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Precio Unit.</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td className="text-right">{item.cantidad}</td>
                  <td className="text-right">${item.precio.toLocaleString('es-CL')}</td>
                  <td className="text-right">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALES */}
        <div className="boleta-totales">
          <div className="total-row">
            <span>Subtotal (sin IVA):</span>
            <span><strong>${preciosDesglose.subtotal.toLocaleString('es-CL')}</strong></span>
          </div>
          <div className="total-row">
            <span>IVA (19%):</span>
            <span><strong>${preciosDesglose.iva.toLocaleString('es-CL')}</strong></span>
          </div>
          <div className="total-row final">
            <span>TOTAL A PAGAR:</span>
            <span>${preciosDesglose.total.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="boleta-footer">
          <p>✅ Compra realizada exitosamente</p>
          <p>Gracias por tu preferencia - Kkarhua</p>
          <p>www.kkarhua.cl | contacto@kkarhua.cl</p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="boleta-actions">
        <button 
          className="btn-print"
          onClick={() => window.print()}
        >
          <i className="bi bi-printer me-2"></i>
          Imprimir Boleta
        </button>
        <button 
          className="btn-close"
          onClick={() => window.close()}
        >
          <i className="bi bi-x-lg me-2"></i>
          Cerrar
        </button>
      </div>
    </div>
  );
}