import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CheckoutModal.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function CheckoutModal({ isOpen, onClose, total, items }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Info Cliente, 2: Dirección
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
    comuna: 'Cerrillos',
    indicaciones: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos del usuario si está logeado
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
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/envios/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEnvios(data);
        if (data.length > 0) {
          setSelectedEnvio(data[0].id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      }
    } catch (error) {
      console.error('Error al cargar envíos:', error);
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
      const token = localStorage.getItem('accessToken');

      let envioId = selectedEnvio;

      // Si es una nueva dirección, guardarla primero
      if (showNewAddressForm) {
        console.log('📍 Creando nueva dirección...');
        
        const envioData = {
          calle: formData.calle.trim(),
          departamento: formData.departamento ? formData.departamento.trim() : null,
          region: formData.region.trim(),
          comuna: formData.comuna.trim(),
          indicaciones: formData.indicaciones ? formData.indicaciones.trim() : null,
          usuarioId: user?.id
        };

        console.log('📦 Datos del envío:', envioData);

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
          console.error('❌ Error del servidor:', errorData);
          throw new Error(errorData.error || 'Error al guardar la dirección');
        }

        const envioCreado = await responseEnvio.json();
        console.log('✅ Envío creado:', envioCreado);
        envioId = envioCreado.id;
      }

      // Aquí va la lógica de pago/confirmación
      const ordersData = {
        cliente: {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          email: formData.correo.trim()
        },
        envio_id: envioId,
        items: items,
        total: total
      };

      console.log('📋 Orden final:', ordersData);

      alert(`✅ Pedido procesado correctamente\n\nTotal: $${total.toLocaleString('es-CL')}\nEnvío guardado: ${envioId}`);
      
      // Limpiar y cerrar
      setStep(1);
      setFormData({
        nombre: '',
        apellidos: '',
        correo: '',
        calle: '',
        departamento: '',
        region: 'Región Metropolitana de Santiago',
        comuna: 'Cerrillos',
        indicaciones: ''
      });
      onClose();
      
      // Aquí iría redirección a confirmación o pago

    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      setErrors({ general: error.message });
      alert('❌ ' + error.message);
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

        {/* Step 1: Información del Cliente */}
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

        {/* Step 2: Dirección de Entrega */}
        {step === 2 && (
          <>
            <div className="checkout-header">
              <h2>Dirección de entrega de los productos</h2>
              <p className="checkout-subtitle">Ingrese dirección de forma detallada</p>
            </div>

            <form className="checkout-form">
              {/* Mostrar envíos guardados si existen y no está en form de nueva dirección */}
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

              {/* Formulario de nueva dirección */}
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
                        <option>Región Metropolitana de Santiago</option>
                        <option>Región de Valparaíso</option>
                        <option>Región de Bío-Bío</option>
                        <option>Región del Maule</option>
                        <option>Región de Antofagasta</option>
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
                      >
                        <option>Cerrillos</option>
                        <option>Santiago</option>
                        <option>Providencia</option>
                        <option>Las Condes</option>
                        <option>Ñuñoa</option>
                        <option>Macul</option>
                        <option>La Florida</option>
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
                      Pagar ahora $ {total.toLocaleString('es-CL')}
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