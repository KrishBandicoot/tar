// src/componentes/CheckoutModal/CheckoutModal.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
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
  const { vaciarCarrito } = useCarrito(); // ← AGREGADO
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

  // ABRIR BOLETA EN NUEVA VENTANA CON DATOS
  const abrirBoleta = (datosCliente, datosEnvio) => {
    const datosBoleta = {
      datosCliente,
      datosEnvio,
      items,
      preciosDesglose
    };

    console.log('💾 Guardando datos de boleta:', datosBoleta);

    try {
      localStorage.setItem('datosBoleta', JSON.stringify(datosBoleta));
      console.log('✅ Datos guardados correctamente');

      requestAnimationFrame(() => {
        setTimeout(() => {
          const ventanaBoleta = window.open('/boleta', '_blank', 'width=900,height=700');
          
          if (!ventanaBoleta) {
            alert('⚠️ Por favor, permite las ventanas emergentes para ver tu boleta');
          }
        }, 200);
      });

    } catch (error) {
      console.error('❌ Error al guardar datos:', error);
      alert('Error al generar la boleta. Por favor intenta nuevamente.');
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

      // PASO 4: GUARDAR COMPRA EN LA BASE DE DATOS
      console.log('💾 Guardando compra en la base de datos...');
      const compraData = {
        usuario: { id: user.id },
        envio: { id: envioId },
        subtotal: preciosDesglose.subtotal,
        iva: preciosDesglose.iva,
        total: preciosDesglose.total,
        detalleProductos: JSON.stringify(items),
        estado: 'completada'
      };

      try {
        const responseCompra = await fetch(`${API_BASE_URL}/compras`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(compraData)
        });

        if (!responseCompra.ok) {
          console.warn('⚠️ Error al guardar compra, pero boleta generada');
        } else {
          const compraGuardada = await responseCompra.json();
          console.log('✅ Compra guardada con ID:', compraGuardada.id);
        }
      } catch (error) {
        console.warn('⚠️ Error al guardar compra:', error);
        // No interrumpimos el flujo, la boleta ya fue generada
      }

      alert('✅ ¡Compra realizada con éxito!\n\nSe ha generado tu boleta de compra.');
      
      // PASO 5: VACIAR EL CARRITO
      console.log('🧹 Limpiando carrito de compras...');
      vaciarCarrito();
      console.log('✅ Carrito vaciado exitosamente');
      
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