// src/componentes/CheckoutModal/CheckoutModal.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CheckoutModal.css';

const API_BASE_URL = 'http://localhost:8080/api';

// Objeto con regiones y sus comunas
const regionesComunas = {
  "Región Metropolitana de Santiago": [
    "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central",
    "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja",
    "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo",
    "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda",
    "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal",
    "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón",
    "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo",
    "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango",
    "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro",
    "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"
  ],
  "Región de Valparaíso": [
    "Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví",
    "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga",
    "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca",
    "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales",
    "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo",
    "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue",
    "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"
  ],
  "Región de Bío-Bío": [
    "Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota",
    "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé",
    "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue",
    "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja",
    "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo",
    "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"
  ],
  "Región del Maule": [
    "Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco",
    "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes",
    "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina",
    "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares",
    "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre",
    "Yerbas Buenas"
  ],
  "Región de Antofagasta": [
    "Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama",
    "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"
  ]
};

export function CheckoutModal({ isOpen, onClose, total, items, preciosDesglose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [envios, setEnvios] = useState([]);
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: '',
    indicaciones: ''
  });

  const [errors, setErrors] = useState({});
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  useEffect(() => {
    if (formData.region) {
      const comunas = regionesComunas[formData.region] || [];
      setComunasDisponibles(comunas);
      
      if (!comunas.includes(formData.comuna)) {
        setFormData(prev => ({ ...prev, comuna: '' }));
      }
    }
  }, [formData.region]);

  useEffect(() => {
    if (user && isOpen) {
      const nombreSplit = user.nombre.split(' ');
      setFormData(prev => ({
        ...prev,
        nombre: nombreSplit[0] || '',
        apellidos: nombreSplit.slice(1).join(' ') || '',
        correo: user.email || ''
      }));
      cargarEnvios(user.id);
      setShowNewAddressForm(false);
    }
  }, [user, isOpen]);

  const cargarEnvios = async (userId) => {
    try {
      console.log('📍 Cargando envíos del usuario:', userId);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/envios/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Envíos cargados:', data);
        setEnvios(data);
        if (data.length > 0) {
          setSelectedEnvio(data[0].id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      } else {
        console.warn('⚠️ No se pudieron cargar los envíos');
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('❌ Error al cargar envíos:', error);
      setShowNewAddressForm(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!showNewAddressForm && !selectedEnvio && envios.length > 0) {
      newErrors.envio = 'Debes seleccionar una dirección';
    }

    if (showNewAddressForm) {
      if (!formData.calle.trim()) {
        newErrors.calle = 'La calle es obligatoria';
      }
      if (!formData.region.trim()) {
        newErrors.region = 'La región es obligatoria';
      }
      if (!formData.comuna.trim()) {
        newErrors.comuna = 'La comuna es obligatoria';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // VALIDAR PRODUCTOS: Estado y Stock
  const validarProductos = async () => {
    const errores = [];
    
    for (const item of items) {
      try {
        const response = await fetch(`${API_BASE_URL}/productos/${item.id}`);
        if (!response.ok) {
          errores.push(`No se pudo verificar el producto: ${item.nombre}`);
          continue;
        }

        const productoActual = await response.json();

        if (productoActual.estado !== 'activo') {
          errores.push(`"${item.nombre}" está INACTIVO y no puede ser comprado`);
        }

        if (productoActual.stock === 0) {
          errores.push(`"${item.nombre}" no tiene STOCK disponible`);
        } else if (productoActual.stock < item.cantidad) {
          errores.push(`"${item.nombre}" solo tiene ${productoActual.stock} unidades disponibles (intentas comprar ${item.cantidad})`);
        }

      } catch (error) {
        errores.push(`Error al verificar "${item.nombre}"`);
      }
    }

    return errores;
  };

  // GENERAR HTML DE LA BOLETA
  const generarHTMLBoleta = (datosCliente, datosEnvio) => {
    const fechaActual = new Date().toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const numeroBoleta = `BOL-${Date.now()}`;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boleta de Compra - Kkarhua</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
            padding: 40px 20px;
          }
          .boleta-container { min-height: 100vh; }
          .boleta {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 2px solid #333;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .boleta-header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .boleta-header h1 {
            font-size: 32px;
            margin-bottom: 5px;
            color: #333;
            font-weight: bold;
          }
          .boleta-header p {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
          }
          .boleta-header p strong {
            color: #333;
            font-size: 16px;
          }
          .boleta-section {
            margin-bottom: 25px;
          }
          .boleta-section h2 {
            font-size: 16px;
            color: #333;
            border-bottom: 2px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .info-row {
            display: flex;
            padding: 6px 0;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
            color: #555;
            flex-shrink: 0;
          }
          .info-value {
            color: #333;
            flex: 1;
          }
          .boleta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .boleta-table th {
            background: #333;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
          }
          .boleta-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
            color: #333;
          }
          .boleta-table tbody tr:hover {
            background: #f9f9f9;
          }
          .text-right {
            text-align: right !important;
          }
          .boleta-totales {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #333;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 15px;
            color: #333;
          }
          .total-row.final {
            font-size: 20px;
            font-weight: bold;
            color: #198754;
            margin-top: 10px;
            padding-top: 15px;
            border-top: 2px solid #333;
          }
          .boleta-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
          }
          .boleta-footer p {
            color: #666;
            font-size: 12px;
            margin: 5px 0;
          }
          .boleta-footer p:first-child {
            color: #198754;
            font-weight: bold;
            font-size: 14px;
          }
          .boleta-actions {
            max-width: 800px;
            margin: 20px auto;
            display: flex;
            gap: 15px;
            justify-content: center;
          }
          .btn-print, .btn-close {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
          }
          .btn-print {
            background: #198754;
            color: white;
          }
          .btn-print:hover {
            background: #157347;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
          }
          .btn-close {
            background: #6c757d;
            color: white;
          }
          .btn-close:hover {
            background: #5a6268;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
          }
          @media (max-width: 768px) {
            body { padding: 20px 10px; }
            .boleta { padding: 30px 20px; }
            .boleta-header h1 { font-size: 24px; }
            .boleta-section h2 { font-size: 14px; }
            .info-row { flex-direction: column; gap: 3px; }
            .info-label { width: 100%; font-size: 12px; }
            .info-value { font-size: 13px; }
            .boleta-table th, .boleta-table td { padding: 8px 6px; font-size: 11px; }
            .total-row { font-size: 13px; }
            .total-row.final { font-size: 16px; }
            .boleta-actions { flex-direction: column; }
            .btn-print, .btn-close { width: 100%; justify-content: center; }
          }
          @media print {
            body { background: white; padding: 0; }
            .boleta { border: 2px solid #333; box-shadow: none; border-radius: 0; max-width: 100%; margin: 0; }
            .boleta-actions { display: none !important; }
            .boleta-table th { background: #333 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-row.final { color: #198754 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="boleta-container">
          <div class="boleta">
            <div class="boleta-header">
              <h1>🛍️ KKARHUA</h1>
              <p>Boleta de Compra Electrónica</p>
              <p><strong>N°: ${numeroBoleta}</strong></p>
              <p>Fecha: ${fechaActual}</p>
            </div>

            <div class="boleta-section">
              <h2>📋 Información del Cliente</h2>
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${datosCliente.nombre} ${datosCliente.apellidos}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo:</span>
                <span class="info-value">${datosCliente.correo}</span>
              </div>
            </div>

            <div class="boleta-section">
              <h2>📦 Dirección de Envío</h2>
              <div class="info-row">
                <span class="info-label">Calle:</span>
                <span class="info-value">${datosEnvio.calle}</span>
              </div>
              ${datosEnvio.departamento ? `
              <div class="info-row">
                <span class="info-label">Departamento:</span>
                <span class="info-value">${datosEnvio.departamento}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Comuna:</span>
                <span class="info-value">${datosEnvio.comuna}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Región:</span>
                <span class="info-value">${datosEnvio.region}</span>
              </div>
              ${datosEnvio.indicaciones ? `
              <div class="info-row">
                <span class="info-label">Indicaciones:</span>
                <span class="info-value">${datosEnvio.indicaciones}</span>
              </div>
              ` : ''}
            </div>

            <div class="boleta-section">
              <h2>🛒 Detalle de la Compra</h2>
              <table class="boleta-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="text-right">Cantidad</th>
                    <th class="text-right">Precio Unit.</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => `
                    <tr>
                      <td>${item.nombre}</td>
                      <td class="text-right">${item.cantidad}</td>
                      <td class="text-right">${item.precio.toLocaleString('es-CL')}</td>
                      <td class="text-right">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="boleta-totales">
              <div class="total-row">
                <span>Subtotal (sin IVA):</span>
                <span><strong>${preciosDesglose.subtotal.toLocaleString('es-CL')}</strong></span>
              </div>
              <div class="total-row">
                <span>IVA (19%):</span>
                <span><strong>${preciosDesglose.iva.toLocaleString('es-CL')}</strong></span>
              </div>
              <div class="total-row final">
                <span>TOTAL A PAGAR:</span>
                <span>${preciosDesglose.total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div class="boleta-footer">
              <p>✅ Compra realizada exitosamente</p>
              <p>Gracias por tu preferencia - Kkarhua</p>
              <p>www.kkarhua.cl | contacto@kkarhua.cl</p>
            </div>
          </div>

          <div class="boleta-actions">
            <button class="btn-print" onclick="window.print()">
              <i class="bi bi-printer"></i>
              Imprimir Boleta
            </button>
            <button class="btn-close" onclick="window.close()">
              <i class="bi bi-x-lg"></i>
              Cerrar
            </button>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // ABRIR BOLETA EN NUEVA VENTANA
  const abrirBoleta = (datosCliente, datosEnvio) => {
    const htmlBoleta = generarHTMLBoleta(datosCliente, datosEnvio);
    const ventanaBoleta = window.open('', '_blank', 'width=900,height=700');
    
    if (ventanaBoleta) {
      ventanaBoleta.document.write(htmlBoleta);
      ventanaBoleta.document.close();
    } else {
      alert('⚠️ Por favor, permite las ventanas emergentes para ver tu boleta');
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePagar = async () => {
    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      // PASO 1: VALIDAR PRODUCTOS
      console.log('🔍 Validando productos...');
      const erroresProductos = await validarProductos();
      
      if (erroresProductos.length > 0) {
        setLoading(false);
        const mensajeError = '❌ ERROR: No se puede completar la compra\n\n' + 
          erroresProductos.map((e, i) => `${i + 1}. ${e}`).join('\n');
        alert(mensajeError);
        return;
      }

      console.log('✅ Todos los productos son válidos');

      const token = localStorage.getItem('accessToken');
      let envioId = selectedEnvio;
      let datosEnvio = null;

      // PASO 2: Crear dirección si es necesaria
      if (showNewAddressForm) {
        console.log('📍 Creando nueva dirección de envío...');
        
        const envioData = {
          calle: formData.calle.trim(),
          departamento: formData.departamento ? formData.departamento.trim() : null,
          region: formData.region.trim(),
          comuna: formData.comuna.trim(),
          indicaciones: formData.indicaciones ? formData.indicaciones.trim() : null,
          usuarioId: user?.id
        };

        const responseEnvio = await fetch(`${API_BASE_URL}/envios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(envioData)
        });

        if (!responseEnvio.ok) {
          const errorData = await responseEnvio.json();
          throw new Error(errorData.error || 'Error al guardar la dirección');
        }

        const envioCreado = await responseEnvio.json();
        console.log('✅ Dirección de envío creada:', envioCreado);
        envioId = envioCreado.id;
        datosEnvio = envioData;
      } else {
        const envioSeleccionado = envios.find(e => e.id === selectedEnvio);
        datosEnvio = {
          calle: envioSeleccionado.calle,
          departamento: envioSeleccionado.departamento,
          region: envioSeleccionado.region,
          comuna: envioSeleccionado.comuna,
          indicaciones: envioSeleccionado.indicaciones
        };
      }

      // PASO 3: GENERAR Y MOSTRAR BOLETA
      console.log('🧾 Generando boleta...');
      
      const datosCliente = {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim()
      };

      abrirBoleta(datosCliente, datosEnvio);

      console.log('✅ Boleta generada exitosamente');
      alert('✅ ¡Compra realizada con éxito!\n\nSe ha generado tu boleta de compra.');
      
      setStep(1);
      setFormData({
        nombre: '',
        apellidos: '',
        correo: '',
        calle: '',
        departamento: '',
        region: 'Región Metropolitana de Santiago',
        comuna: '',
        indicaciones: ''
      });
      onClose();

    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      setErrors({ general: error.message });
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        {step === 1 && (
          <>
            <div className="checkout-header">
              <h2>Información del cliente</h2>
              <p className="checkout-subtitle">Completa la siguiente información</p>
            </div>

            <form className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre<span className="required">*</span></label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    className={errors.nombre ? 'is-invalid' : ''}
                  />
                  {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos<span className="required">*</span></label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    placeholder="Pérez García"
                    className={errors.apellidos ? 'is-invalid' : ''}
                  />
                  {errors.apellidos && <span className="error-text">{errors.apellidos}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="correo">Correo<span className="required">*</span></label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={errors.correo ? 'is-invalid' : ''}
                />
                {errors.correo && <span className="error-text">{errors.correo}</span>}
              </div>

              <div className="checkout-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  <i className="bi bi-x-lg me-2"></i>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Siguiente
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="checkout-header">
              <h2>Dirección de entrega</h2>
              <p className="checkout-subtitle">Selecciona o ingresa una dirección</p>
            </div>

            <form className="checkout-form">
              {envios.length > 0 && !showNewAddressForm && (
                <div className="envios-section">
                  <h3 className="section-title">Mis direcciones guardadas</h3>
                  <div className="envios-list">
                    {envios.map((envio) => (
                      <label key={envio.id} className="envio-option">
                        <input
                          type="radio"
                          name="envio"
                          value={envio.id}
                          checked={selectedEnvio === envio.id}
                          onChange={(e) => setSelectedEnvio(parseInt(e.target.value))}
                        />
                        <div className="envio-details">
                          <p className="envio-calle">{envio.calle}</p>
                          <p className="envio-ubicacion">
                            {envio.departamento && `${envio.departamento}, `}
                            {envio.comuna}, {envio.region}
                          </p>
                          {envio.indicaciones && (
                            <p className="envio-indicaciones">
                              <i className="bi bi-info-circle me-1"></i>
                              {envio.indicaciones}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <button 
                    type="button"
                    className="btn-add-address"
                    onClick={() => setShowNewAddressForm(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar nueva dirección
                  </button>
                </div>
              )}

              {showNewAddressForm && (
                <div className="new-address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="calle">Calle<span className="required">*</span></label>
                      <input
                        type="text"
                        id="calle"
                        name="calle"
                        value={formData.calle}
                        onChange={handleInputChange}
                        placeholder="Av. Principal 123"
                        className={errors.calle ? 'is-invalid' : ''}
                      />
                      {errors.calle && <span className="error-text">{errors.calle}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="departamento">Departamento (opcional)</label>
                      <input
                        type="text"
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        placeholder="Ej: 603"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="region">Región<span className="required">*</span></label>
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className={errors.region ? 'is-invalid' : ''}
                      >
                        {Object.keys(regionesComunas).map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                      {errors.region && <span className="error-text">{errors.region}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="comuna">Comuna<span className="required">*</span></label>
                      <select
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleInputChange}
                        className={errors.comuna ? 'is-invalid' : ''}
                        disabled={comunasDisponibles.length === 0}
                      >
                        <option value="">Seleccionar comuna...</option>
                        {comunasDisponibles.map((comuna) => (
                          <option key={comuna} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </select>
                      {errors.comuna && <span className="error-text">{errors.comuna}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="indicaciones">Indicaciones para la entrega (opcional)</label>
                    <textarea
                      id="indicaciones"
                      name="indicaciones"
                      value={formData.indicaciones}
                      onChange={handleInputChange}
                      placeholder="Ej: Entre calles, color del edificio, no tiene timbre..."
                      rows="3"
                    />
                  </div>

                  {envios.length > 0 && (
                    <button
                      type="button"
                      className="btn-cancel-new"
                      onClick={() => {
                        setShowNewAddressForm(false);
                        if (envios.length > 0) {
                          setSelectedEnvio(envios[0].id);
                        }
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Usar dirección guardada
                    </button>
                  )}
                </div>
              )}

              {errors.general && (
                <div className="alert alert-danger">
                  {errors.general}
                </div>
              )}

              {errors.envio && (
                <div className="alert alert-danger">
                  {errors.envio}
                </div>
              )}

              <div className="checkout-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Atrás
                </button>
                <button 
                  type="button" 
                  className="btn-success"
                  onClick={handlePagar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-receipt me-2"></i>
                      Generar Boleta
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}