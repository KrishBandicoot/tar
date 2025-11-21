import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Envios.css';

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

export function Envios() {
    const navigate = useNavigate();
    const [envios, setEnvios] = useState([]);
    const [enviosFiltrados, setEnviosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [envioEditar, setEnvioEditar] = useState(null);
    const [guardandoEnvio, setGuardandoEnvio] = useState(false);
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    const menuItems = [
        { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
        { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
        { icon: 'bi-plus-circle', label: 'Crear Producto', path: '/crear-producto' },
        { icon: 'bi-people', label: 'Usuarios', path: '/usuarios' },
        { icon: 'bi-person-plus', label: 'Crear Usuario', path: '/crear-usuario' },
        { icon: 'bi-tag', label: 'Categorías', path: '/categorias' },
        { icon: 'bi-truck', label: 'Envíos', path: '/envios' },
        { icon: 'bi-cart-check', label: 'Compras', path: '/compras'},
        { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
        { icon: 'bi-house', label: 'Inicio', path: '/' }
    ];

    useEffect(() => {
        cargarEnvios();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === '') {
            setEnviosFiltrados(envios);
        } else {
            const filtrados = envios.filter(envio =>
                envio.calle.toLowerCase().includes(busqueda.toLowerCase()) ||
                envio.comuna.toLowerCase().includes(busqueda.toLowerCase()) ||
                envio.region.toLowerCase().includes(busqueda.toLowerCase()) ||
                envio.usuario?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                envio.usuario?.email.toLowerCase().includes(busqueda.toLowerCase())
            );
            setEnviosFiltrados(filtrados);
        }
    }, [busqueda, envios]);

    useEffect(() => {
        if (envioEditar && envioEditar.region) {
            const comunas = regionesComunas[envioEditar.region] || [];
            setComunasDisponibles(comunas);
        }
    }, [envioEditar?.region]);

    const cargarEnvios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            
            console.log('🔄 Cargando envíos...');
            console.log('📍 URL:', `${API_BASE_URL}/envios`);
            console.log('🔐 Token disponible:', !!token);

            const response = await fetch(`${API_BASE_URL}/envios`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Response status:', response.status);

            if (!response.ok) {
                console.error('❌ Error en respuesta:', response.statusText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Envíos cargados:', data.length);

            setEnvios(data);
            setEnviosFiltrados(data);
            setError(null);
        } catch (error) {
            console.error('❌ Error al cargar envíos:', error);
            setError(`No se pudieron cargar los envíos: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleEliminar = async (id, calle) => {
        if (!window.confirm(`¿Estás seguro de eliminar la dirección "${calle}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/envios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar envío');

            alert('✅ Dirección de envío eliminada exitosamente');
            cargarEnvios();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error al eliminar la dirección de envío');
        }
    };

    const abrirModalEditar = (envio) => {
        setEnvioEditar({
            ...envio,
            departamento: envio.departamento || '',
            indicaciones: envio.indicaciones || ''
        });
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setEnvioEditar(null);
        setComunasDisponibles([]);
    };

    const handleCambioEnvio = (e) => {
        const { name, value } = e.target;
        setEnvioEditar(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardarEnvio = async (e) => {
        e.preventDefault();
        setGuardandoEnvio(true);

        try {
            const token = localStorage.getItem('accessToken');
            const envioActualizado = {
                calle: envioEditar.calle.trim(),
                departamento: envioEditar.departamento ? envioEditar.departamento.trim() : null,
                region: envioEditar.region.trim(),
                comuna: envioEditar.comuna.trim(),
                indicaciones: envioEditar.indicaciones ? envioEditar.indicaciones.trim() : null
            };

            const response = await fetch(`${API_BASE_URL}/envios/${envioEditar.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(envioActualizado)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar envío');
            }

            alert('✅ Dirección de envío actualizada exitosamente');
            cerrarModal();
            cargarEnvios();
        } catch (error) {
            alert('❌ Error al guardar cambios: ' + error.message);
        } finally {
            setGuardandoEnvio(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-wrapper">
                <Sidebar menuItems={menuItems} currentPath="/envios" />

                <main className="admin-main">
                    <div className="envios-header">
                        <h1 className="page-title">Gestión de Direcciones de Envío</h1>
                    </div>

                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar por dirección, usuario o email..."
                                value={busqueda}
                                onChange={handleBusquedaChange}
                            />
                            {busqueda && (
                                <button 
                                    className="clear-search"
                                    onClick={() => setBusqueda('')}
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            )}
                        </div>
                        <div className="search-results-count">
                            {enviosFiltrados.length} dirección{enviosFiltrados.length !== 1 ? 'es' : ''} encontrada{enviosFiltrados.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando direcciones de envío...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                            <button className="btn btn-sm btn-primary ms-2" onClick={cargarEnvios}>
                                Reintentar
                            </button>
                        </div>
                    ) : enviosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-truck empty-icon"></i>
                            <h3>No se encontraron direcciones</h3>
                            <p>
                                {busqueda 
                                    ? `No hay direcciones que coincidan con "${busqueda}"`
                                    : 'Aún no hay direcciones de envío registradas'}
                            </p>
                        </div>
                    ) : (
                        <div className="envios-grid">
                            {enviosFiltrados.map((envio) => (
                                <div key={envio.id} className="envio-card">
                                    <div className="envio-card-header">
                                        <div className="envio-id">
                                            <i className="bi bi-hash"></i>
                                            ID: {envio.id}
                                        </div>
                                        <div className="envio-acciones">
                                            <button 
                                                className="btn-editar-small"
                                                onClick={() => abrirModalEditar(envio)}
                                                title="Editar dirección"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                className="btn-eliminar-small"
                                                onClick={() => handleEliminar(envio.id, envio.calle)}
                                                title="Eliminar dirección"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="envio-card-body">
                                        <div className="envio-direccion">
                                            <i className="bi bi-geo-alt-fill"></i>
                                            <div>
                                                <p className="envio-calle">{envio.calle}</p>
                                                {envio.departamento && (
                                                    <p className="envio-detalle">Depto: {envio.departamento}</p>
                                                )}
                                                <p className="envio-ubicacion">
                                                    {envio.comuna}, {envio.region}
                                                </p>
                                            </div>
                                        </div>

                                        {envio.indicaciones && (
                                            <div className="envio-indicaciones">
                                                <i className="bi bi-info-circle"></i>
                                                <p>{envio.indicaciones}</p>
                                            </div>
                                        )}

                                        <div className="envio-usuario">
                                            <i className="bi bi-person-circle"></i>
                                            <div>
                                                <p className="usuario-nombre">{envio.usuario?.nombre || 'Usuario desconocido'}</p>
                                                <p className="usuario-email">{envio.usuario?.email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="envio-fechas">
                                            <div className="fecha-item">
                                                <i className="bi bi-calendar-plus"></i>
                                                <div>
                                                    <small>Creado:</small>
                                                    <p>{formatearFecha(envio.fechaCreacion)}</p>
                                                </div>
                                            </div>
                                            {envio.fechaActualizacion && envio.fechaActualizacion !== envio.fechaCreacion && (
                                                <div className="fecha-item">
                                                    <i className="bi bi-calendar-check"></i>
                                                    <div>
                                                        <small>Actualizado:</small>
                                                        <p>{formatearFecha(envio.fechaActualizacion)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Editar Envío */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <i className="bi bi-pencil me-2"></i>
                                Editar Dirección de Envío
                            </h2>
                            <button className="modal-close" onClick={cerrarModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleGuardarEnvio}>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Usuario asociado: <strong>{envioEditar?.usuario?.nombre}</strong> ({envioEditar?.usuario?.email})
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="calle">
                                            <i className="bi bi-signpost me-2"></i>
                                            Calle <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="calle"
                                            name="calle"
                                            value={envioEditar?.calle || ''}
                                            onChange={handleCambioEnvio}
                                            required
                                            maxLength={200}
                                            placeholder="Av. Principal 123"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="departamento">
                                            <i className="bi bi-building me-2"></i>
                                            Departamento
                                        </label>
                                        <input
                                            type="text"
                                            id="departamento"
                                            name="departamento"
                                            value={envioEditar?.departamento || ''}
                                            onChange={handleCambioEnvio}
                                            maxLength={50}
                                            placeholder="Ej: 603"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="region">
                                            <i className="bi bi-map me-2"></i>
                                            Región <span className="required">*</span>
                                        </label>
                                        <select
                                            id="region"
                                            name="region"
                                            value={envioEditar?.region || ''}
                                            onChange={handleCambioEnvio}
                                            required
                                        >
                                            {Object.keys(regionesComunas).map((region) => (
                                                <option key={region} value={region}>
                                                    {region}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comuna">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            Comuna <span className="required">*</span>
                                        </label>
                                        <select
                                            id="comuna"
                                            name="comuna"
                                            value={envioEditar?.comuna || ''}
                                            onChange={handleCambioEnvio}
                                            required
                                            disabled={comunasDisponibles.length === 0}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {comunasDisponibles.map((comuna) => (
                                                <option key={comuna} value={comuna}>
                                                    {comuna}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="indicaciones">
                                        <i className="bi bi-chat-left-text me-2"></i>
                                        Indicaciones para la entrega
                                    </label>
                                    <textarea
                                        id="indicaciones"
                                        name="indicaciones"
                                        value={envioEditar?.indicaciones || ''}
                                        onChange={handleCambioEnvio}
                                        rows="3"
                                        maxLength={500}
                                        placeholder="Ej: Entre calles, color del edificio, no tiene timbre..."
                                    />
                                    <small className="char-count">
                                        {(envioEditar?.indicaciones || '').length}/500 caracteres
                                    </small>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn-cancelar"
                                    onClick={cerrarModal}
                                    disabled={guardandoEnvio}
                                >
                                    <i className="bi bi-x-lg"></i>
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-guardar"
                                    disabled={guardandoEnvio}
                                >
                                    {guardandoEnvio ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}