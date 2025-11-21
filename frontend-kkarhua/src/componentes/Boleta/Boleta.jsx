// src/componentes/Boleta/Boleta.jsx
import './Boleta.css';

export function Boleta({ datosCliente, datosEnvio, items, preciosDesglose }) {
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
        <div className="boleta-header">
          <h1>🛍️ KKARHUA</h1>
          <p>Boleta de Compra Electrónica</p>
          <p><strong>N°: {numeroBoleta}</strong></p>
          <p>Fecha: {fechaActual}</p>
        </div>

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

        <div className="boleta-footer">
          <p>✅ Compra realizada exitosamente</p>
          <p>Gracias por tu preferencia - Kkarhua</p>
          <p>www.kkarhua.cl | contacto@kkarhua.cl</p>
        </div>
      </div>

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