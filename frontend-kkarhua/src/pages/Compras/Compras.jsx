// src/pages/Compras/Compras.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Compras.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Compras() {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [comprasFiltradas, setComprasFiltradas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [modalAbierto, setModalAbierto] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);

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

    useEffect(() => {
        cargarCompras();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === '') {
            setComprasFiltradas(compras);
        } else {
            const filtradas = compras.filter(compra =>
                compra.usuario?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                compra.usuario?.email.toLowerCase().includes(busqueda.toLowerCase()) ||
                compra.id.toString().includes(busqueda)
            );
            setComprasFiltradas(filtradas);
        }
    }, [busqueda, compras]);

    const cargarCompras = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/compras`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar compras');
            const data = await response.json();
            // Ordenar por fecha más reciente primero
            const comprasOrdenadas = data.sort((a, b) => 
                new Date(b.fechaCompra) - new Date(a.fechaCompra)
            );
            setCompras(comprasOrdenadas);
            setComprasFiltradas(comprasOrdenadas);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron cargar las compras');
        } finally {
            setLoading(false);
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const abrirModalDetalle = (compra) => {
        setCompraSeleccionada(compra);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setCompraSeleccionada(null);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoBadgeClass = (estado) => {
        switch(estado?.toLowerCase()) {
            case 'completada': return 'bg-success';
            case 'pendiente': return 'bg-warning';
            case 'cancelada': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const parsearDetalleProductos = (detalleJson) => {
        try {
            return JSON.parse(detalleJson);
        } catch (error) {
            console.error('Error al parsear detalle de productos:', error);
            return [];
        }
    };

    const imprimirBoleta = () => {
        window.print();
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-wrapper">
                <Sidebar menuItems={menuItems} currentPath="/compras" />

                <main className="admin-main">
                    <div className="compras-header">
                        <h1 className="page-title">Historial de Compras</h1>
                    </div>

                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar por ID, usuario o email..."
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
                            {comprasFiltradas.length} compra{comprasFiltradas.length !== 1 ? 's' : ''} encontrada{comprasFiltradas.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando compras...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : comprasFiltradas.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-cart-x empty-icon"></i>
                            <h3>No se encontraron compras</h3>
                            <p>
                                {busqueda 
                                    ? `No hay compras que coincidan con "${busqueda}"`
                                    : 'Aún no hay compras registradas en el sistema'}
                            </p>
                        </div>
                    ) : (
                        <div className="compras-grid">
                            {comprasFiltradas.map((compra) => {
                                const productos = parsearDetalleProductos(compra.detalleProductos);
                                const totalProductos = productos.reduce((sum, p) => sum + p.cantidad, 0);
                                
                                return (
                                    <div key={compra.id} className="compra-card">
                                        <div className="compra-card-header">
                                            <div className="compra-id">
                                                <i className="bi bi-receipt"></i>
                                                <span>Compra #{compra.id}</span>
                                            </div>
                                            <span className={`badge ${getEstadoBadgeClass(compra.estado)}`}>
                                                {compra.estado}
                                            </span>
                                        </div>

                                        <div className="compra-card-body">
                                            <div className="compra-info-section">
                                                <div className="info-row">
                                                    <i className="bi bi-person-circle"></i>
                                                    <div>
                                                        <p className="info-label">Cliente</p>
                                                        <p className="info-value">{compra.usuario?.nombre || 'N/A'}</p>
                                                        <p className="info-detail">{compra.usuario?.email || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div className="info-row">
                                                    <i className="bi bi-geo-alt-fill"></i>
                                                    <div>
                                                        <p className="info-label">Dirección de envío</p>
                                                        <p className="info-value">{compra.envio?.calle || 'N/A'}</p>
                                                        <p className="info-detail">
                                                            {compra.envio?.comuna}, {compra.envio?.region}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="info-row">
                                                    <i className="bi bi-calendar-event"></i>
                                                    <div>
                                                        <p className="info-label">Fecha de compra</p>
                                                        <p className="info-value">{formatearFecha(compra.fechaCompra)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="compra-productos-preview">
                                                <p className="preview-title">
                                                    <i className="bi bi-box-seam me-2"></i>
                                                    {totalProductos} producto{totalProductos !== 1 ? 's' : ''} comprado{totalProductos !== 1 ? 's' : ''}
                                                </p>
                                                <div className="productos-list">
                                                    {productos.slice(0, 3).map((prod, idx) => (
                                                        <div key={idx} className="producto-preview-item">
                                                            <span className="producto-nombre">{prod.nombre}</span>
                                                            <span className="producto-cantidad">x{prod.cantidad}</span>
                                                        </div>
                                                    ))}
                                                    {productos.length > 3 && (
                                                        <p className="mas-productos">
                                                            +{productos.length - 3} producto{productos.length - 3 !== 1 ? 's' : ''} más
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="compra-totales">
                                                <div className="total-row">
                                                    <span>Subtotal:</span>
                                                    <span>${compra.subtotal?.toLocaleString('es-CL')}</span>
                                                </div>
                                                <div className="total-row">
                                                    <span>IVA (19%):</span>
                                                    <span>${compra.iva?.toLocaleString('es-CL')}</span>
                                                </div>
                                                <div className="total-row total-final">
                                                    <span>Total:</span>
                                                    <span>${compra.total?.toLocaleString('es-CL')}</span>
                                                </div>
                                            </div>

                                            <button 
                                                className="btn-ver-detalle"
                                                onClick={() => abrirModalDetalle(compra)}
                                            >
                                                <i className="bi bi-eye me-2"></i>
                                                Ver Boleta Completa
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Boleta Completa */}
            {modalAbierto && compraSeleccionada && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-boleta" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={cerrarModal}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div className="boleta-content">
                            {/* Header de la boleta */}
                            <div className="boleta-header">
                                <h1>🛍️ KKARHUA</h1>
                                <p>Boleta de Compra Electrónica</p>
                                <p><strong>N°: BOL-{compraSeleccionada.id}</strong></p>
                                <p>Fecha: {formatearFecha(compraSeleccionada.fechaCompra)}</p>
                            </div>

                            {/* Información del cliente */}
                            <div className="boleta-section">
                                <h2>📋 Información del Cliente</h2>
                                <div className="info-row">
                                    <span className="info-label">Nombre:</span>
                                    <span className="info-value">{compraSeleccionada.usuario?.nombre}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Correo:</span>
                                    <span className="info-value">{compraSeleccionada.usuario?.email}</span>
                                </div>
                            </div>

                            {/* Dirección de envío */}
                            <div className="boleta-section">
                                <h2>📦 Dirección de Envío</h2>
                                <div className="info-row">
                                    <span className="info-label">Calle:</span>
                                    <span className="info-value">{compraSeleccionada.envio?.calle}</span>
                                </div>
                                {compraSeleccionada.envio?.departamento && (
                                    <div className="info-row">
                                        <span className="info-label">Departamento:</span>
                                        <span className="info-value">{compraSeleccionada.envio.departamento}</span>
                                    </div>
                                )}
                                <div className="info-row">
                                    <span className="info-label">Comuna:</span>
                                    <span className="info-value">{compraSeleccionada.envio?.comuna}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Región:</span>
                                    <span className="info-value">{compraSeleccionada.envio?.region}</span>
                                </div>
                                {compraSeleccionada.envio?.indicaciones && (
                                    <div className="info-row">
                                        <span className="info-label">Indicaciones:</span>
                                        <span className="info-value">{compraSeleccionada.envio.indicaciones}</span>
                                    </div>
                                )}
                            </div>

                            {/* Detalle de productos */}
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
                                        {parsearDetalleProductos(compraSeleccionada.detalleProductos).map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.nombre}</td>
                                                <td className="text-right">{item.cantidad}</td>
                                                <td className="text-right">${item.precio?.toLocaleString('es-CL')}</td>
                                                <td className="text-right">${(item.precio * item.cantidad)?.toLocaleString('es-CL')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totales */}
                            <div className="boleta-totales">
                                <div className="total-row">
                                    <span>Subtotal (sin IVA):</span>
                                    <span><strong>${compraSeleccionada.subtotal?.toLocaleString('es-CL')}</strong></span>
                                </div>
                                <div className="total-row">
                                    <span>IVA (19%):</span>
                                    <span><strong>${compraSeleccionada.iva?.toLocaleString('es-CL')}</strong></span>
                                </div>
                                <div className="total-row final">
                                    <span>TOTAL A PAGAR:</span>
                                    <span>${compraSeleccionada.total?.toLocaleString('es-CL')}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="boleta-footer">
                                <p>✅ Compra realizada exitosamente</p>
                                <p>Gracias por tu preferencia - Kkarhua</p>
                                <p>www.kkarhua.cl | contacto@kkarhua.cl</p>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="modal-actions">
                            <button 
                                className="btn-print"
                                onClick={imprimirBoleta}
                            >
                                <i className="bi bi-printer me-2"></i>
                                Imprimir
                            </button>
                            <button 
                                className="btn-close-modal"
                                onClick={cerrarModal}
                            >
                                <i className="bi bi-x-lg me-2"></i>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}