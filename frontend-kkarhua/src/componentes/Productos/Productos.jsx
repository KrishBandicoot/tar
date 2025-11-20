import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../Navbar/AdminNavbar';
import { Sidebar } from '../Sidebar/Sidebar';
import './Productos.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Productos() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [archivoImagen, setArchivoImagen] = useState(null);
    const [guardandoProducto, setGuardandoProducto] = useState(false);

    const menuItems = [
        { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
        { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
        { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
        { icon: 'bi-house', label: 'Inicio', path: '/' }
    ];

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === '') {
            setProductosFiltrados(productos);
        } else {
            const filtrados = productos.filter(prod =>
                prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
            setProductosFiltrados(filtrados);
        }
    }, [busqueda, productos]);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/productos`);
            if (!response.ok) throw new Error('Error al cargar productos');
            const data = await response.json();
            setProductos(data);
            setProductosFiltrados(data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias`);
            if (!response.ok) throw new Error('Error al cargar categorías');
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const getImageUrl = (imagen) => {
        if (!imagen) return 'https://via.placeholder.com/300x200?text=Sin+Imagen';
        if (imagen.startsWith('http')) return imagen;
        return `${API_BASE_URL}/imagenes/${imagen}`;
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar producto');

            alert('Producto eliminado exitosamente');
            cargarProductos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el producto');
        }
    };

    const abrirModalEditar = (producto) => {
        setProductoEditar({
            ...producto,
            categoria: producto.categoria?.id || ''
        });
        setImagenPreview(getImageUrl(producto.imagen));
        setArchivoImagen(null);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setProductoEditar(null);
        setImagenPreview(null);
        setArchivoImagen(null);
    };

    const handleCambioProducto = (e) => {
        const { name, value } = e.target;
        setProductoEditar(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCambioImagen = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe superar 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Solo se permiten archivos de imagen');
                return;
            }
            setArchivoImagen(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGuardarProducto = async (e) => {
        e.preventDefault();
        setGuardandoProducto(true);

        try {
            const productoActualizado = {
                nombre: productoEditar.nombre,
                descripcion: productoEditar.descripcion,
                precio: parseFloat(productoEditar.precio),
                stock: parseInt(productoEditar.stock),
                categoria: { id: parseInt(productoEditar.categoria) },
                estado: productoEditar.estado,
                imagen: productoEditar.imagen
            };

            const response = await fetch(`${API_BASE_URL}/productos/${productoEditar.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoActualizado)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar producto');
            }

            if (archivoImagen) {
                const formData = new FormData();
                formData.append('file', archivoImagen);

                const imgResponse = await fetch(`${API_BASE_URL}/imagenes/upload/${productoEditar.id}`, {
                    method: 'POST',
                    body: formData
                });

                if (!imgResponse.ok) {
                    alert('Producto actualizado, pero hubo un error al subir la imagen');
                }
            }

            alert('✅ Producto actualizado exitosamente');
            cerrarModal();
            cargarProductos();
        } catch (error) {
            alert('Error al guardar cambios: ' + error.message);
        } finally {
            setGuardandoProducto(false);
        }
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-wrapper">
                <Sidebar menuItems={menuItems} currentPath="/productos" />

                <main className="admin-main">
                    <div className="productos-header">
                        <h1 className="page-title">Gestión de Productos</h1>
                    </div>

                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar producto por nombre..."
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
                            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando productos...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : productosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-inbox empty-icon"></i>
                            <h3>No se encontraron productos</h3>
                            <p>
                                {busqueda 
                                    ? `No hay productos que coincidan con "${busqueda}"`
                                    : 'Aún no has agregado productos'}
                            </p>
                        </div>
                    ) : (
                        <div className="productos-grid">
                            {productosFiltrados.map((producto) => (
                                <div key={producto.id} className="producto-card">
                                    <div className="producto-imagen">
                                        <img 
                                            src={getImageUrl(producto.imagen)} 
                                            alt={producto.nombre}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                                            }}
                                        />
                                        <span className={`estado-badge ${producto.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                                            {producto.estado}
                                        </span>
                                    </div>
                                    <div className="producto-info">
                                        <h3 className="producto-nombre">{producto.nombre}</h3>
                                        <p className="producto-descripcion">
                                            {producto.descripcion?.length > 80 
                                                ? producto.descripcion.substring(0, 80) + '...'
                                                : producto.descripcion}
                                        </p>
                                        <div className="producto-detalles">
                                            <div className="detalle-item">
                                                <i className="bi bi-cash"></i>
                                                <span>${producto.precio?.toLocaleString('es-CL')}</span>
                                            </div>
                                            <div className="detalle-item">
                                                <i className="bi bi-box-seam"></i>
                                                <span>Stock: {producto.stock || 0}</span>
                                            </div>
                                            <div className="detalle-item">
                                                <i className="bi bi-tag"></i>
                                                <span>{producto.categoria?.nombre || 'Sin categoría'}</span>
                                            </div>
                                        </div>
                                        <div className="producto-acciones">
                                            <button 
                                                className="btn-editar"
                                                onClick={() => abrirModalEditar(producto)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                                Modificar
                                            </button>
                                            <button 
                                                className="btn-eliminar"
                                                onClick={() => handleEliminar(producto.id, producto.nombre)}
                                            >
                                                <i className="bi bi-trash"></i>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Modificar Producto</h2>
                            <button className="modal-close" onClick={cerrarModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleGuardarProducto}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Imagen del Producto</label>
                                    <div className="imagen-upload">
                                        <div className="imagen-preview">
                                            <img src={imagenPreview} alt="Preview" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCambioImagen}
                                            id="imagen-input"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="imagen-input" className="btn-cambiar-imagen">
                                            <i className="bi bi-camera"></i>
                                            Cambiar Imagen
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre *</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={productoEditar.nombre}
                                            onChange={handleCambioProducto}
                                            required
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Precio *</label>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={productoEditar.precio}
                                            onChange={handleCambioProducto}
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Descripción *</label>
                                    <textarea
                                        name="descripcion"
                                        value={productoEditar.descripcion}
                                        onChange={handleCambioProducto}
                                        required
                                        rows="3"
                                        maxLength={500}
                                    />
                                    <small>{productoEditar.descripcion?.length || 0}/500</small>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={productoEditar.stock}
                                            onChange={handleCambioProducto}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Categoría *</label>
                                        <select
                                            name="categoria"
                                            value={productoEditar.categoria}
                                            onChange={handleCambioProducto}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn-cancelar"
                                    onClick={cerrarModal}
                                    disabled={guardandoProducto}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-guardar"
                                    disabled={guardandoProducto}
                                >
                                    {guardandoProducto ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-2"></i>
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