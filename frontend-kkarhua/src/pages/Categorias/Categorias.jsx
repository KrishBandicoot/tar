import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Categorias.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Categorias() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [categoriaEditar, setCategoriaEditar] = useState(null);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [errorNombre, setErrorNombre] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Datos de productos por categoría (para mostrar estadísticas)
    const [productosStats, setProductosStats] = useState({});

    const menuItems = [
        { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
        { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
        { icon: 'bi-plus-circle', label: 'Crear Producto', path: '/crear-producto' },
        { icon: 'bi-people', label: 'Usuarios', path: '/usuarios' },
        { icon: 'bi-person-plus', label: 'Crear Usuario', path: '/crear-usuario' },
        { icon: 'bi-tag', label: 'Categorías', path: '/categorias' },
        { icon: 'bi-truck', label: 'Envíos', path: '/envios'},
        { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
        { icon: 'bi-house', label: 'Inicio', path: '/' }
    ];

    useEffect(() => {
        cargarCategorias();
        cargarProductosStats();
    }, []);

    const cargarCategorias = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categorias`);
            if (!response.ok) throw new Error('Error al cargar categorías');
            const data = await response.json();
            setCategorias(data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const cargarProductosStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos`);
            if (!response.ok) return;
            const productos = await response.json();
            
            // Contar productos por categoría
            const stats = {};
            productos.forEach(producto => {
                const catId = producto.categoria?.id;
                if (catId) {
                    stats[catId] = (stats[catId] || 0) + 1;
                }
            });
            setProductosStats(stats);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setCategoriaEditar(null);
        setNombreCategoria('');
        setErrorNombre('');
        setModalAbierto(true);
    };

    const abrirModalEditar = (categoria) => {
        setModoEdicion(true);
        setCategoriaEditar(categoria);
        setNombreCategoria(categoria.nombre);
        setErrorNombre('');
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setModoEdicion(false);
        setCategoriaEditar(null);
        setNombreCategoria('');
        setErrorNombre('');
    };

    const handleNombreChange = (e) => {
        setNombreCategoria(e.target.value);
        if (errorNombre) setErrorNombre('');
    };

    const validarFormulario = () => {
        if (!nombreCategoria.trim()) {
            setErrorNombre('El nombre es obligatorio');
            return false;
        }
        if (nombreCategoria.trim().length < 3) {
            setErrorNombre('El nombre debe tener al menos 3 caracteres');
            return false;
        }
        if (nombreCategoria.trim().length > 50) {
            setErrorNombre('El nombre no puede tener más de 50 caracteres');
            return false;
        }
        return true;
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) return;

        setGuardando(true);
        const token = localStorage.getItem('accessToken');

        try {
            const categoriaData = {
                nombre: nombreCategoria.trim()
            };

            let response;
            if (modoEdicion) {
                // Actualizar categoría existente
                response = await fetch(`${API_BASE_URL}/categorias/${categoriaEditar.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(categoriaData)
                });
            } else {
                // Crear nueva categoría
                response = await fetch(`${API_BASE_URL}/categorias`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(categoriaData)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                if (data.error) {
                    throw new Error(data.error);
                }
                throw new Error(modoEdicion ? 'Error al actualizar categoría' : 'Error al crear categoría');
            }

            alert(modoEdicion ? '✅ Categoría actualizada exitosamente' : '✅ Categoría creada exitosamente');
            cerrarModal();
            cargarCategorias();

        } catch (error) {
            console.error('Error:', error);
            setErrorNombre(error.message || 'Error al guardar la categoría');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (categoria) => {
        const cantidadProductos = productosStats[categoria.id] || 0;
        
        if (cantidadProductos > 0) {
            alert(`No se puede eliminar la categoría "${categoria.nombre}" porque tiene ${cantidadProductos} producto(s) asociado(s). Primero debes reasignar o eliminar esos productos.`);
            return;
        }

        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/categorias/${categoria.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error) {
                    throw new Error(data.error);
                }
                throw new Error('Error al eliminar categoría');
            }

            alert('✅ Categoría eliminada exitosamente');
            cargarCategorias();
            cargarProductosStats();

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al eliminar la categoría');
        }
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-wrapper">
                <Sidebar menuItems={menuItems} currentPath="/categorias" />

                <main className="admin-main">
                    <div className="categorias-header">
                        <h1 className="page-title">Gestión de Categorías</h1>
                        <button 
                            className="btn-crear-categoria"
                            onClick={abrirModalCrear}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Nueva Categoría
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando categorías...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <i className="bi bi-exclamation-triangle"></i>
                            {error}
                        </div>
                    ) : categorias.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-tags empty-icon"></i>
                            <h3>No hay categorías</h3>
                            <p>Crea tu primera categoría para organizar tus productos</p>
                            <button 
                                className="btn-crear-categoria"
                                onClick={abrirModalCrear}
                            >
                                <i className="bi bi-plus-circle"></i>
                                Crear Primera Categoría
                            </button>
                        </div>
                    ) : (
                        <div className="categorias-grid">
                            {categorias.map((categoria) => {
                                const cantidadProductos = productosStats[categoria.id] || 0;
                                
                                return (
                                    <div key={categoria.id} className="categoria-card">
                                        <div className="categoria-header">
                                            <div className="categoria-icon">
                                                <i className="bi bi-tag"></i>
                                            </div>
                                            <div className="categoria-acciones">
                                                <button 
                                                    className="btn-editar-cat"
                                                    onClick={() => abrirModalEditar(categoria)}
                                                    title="Editar categoría"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button 
                                                    className="btn-eliminar-cat"
                                                    onClick={() => handleEliminar(categoria)}
                                                    title="Eliminar categoría"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="categoria-info">
                                            <h3 className="categoria-nombre">{categoria.nombre}</h3>
                                            
                                            <div className="categoria-stats">
                                                <div className="stat-item">
                                                    <i className="bi bi-hash"></i>
                                                    <span>ID: <span className="stat-value">{categoria.id}</span></span>
                                                </div>
                                                <div className="stat-item">
                                                    <i className="bi bi-box-seam"></i>
                                                    <span>
                                                        <span className="stat-value">{cantidadProductos}</span> producto{cantidadProductos !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Crear/Editar Categoría */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <i className={`bi bi-${modoEdicion ? 'pencil' : 'plus-circle'} me-2`}></i>
                                {modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button className="modal-close" onClick={cerrarModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleGuardar}>
                            <div className="modal-body">
                                {errorNombre && errorNombre.includes('existe') && (
                                    <div className="alert alert-warning">
                                        <i className="bi bi-exclamation-triangle"></i>
                                        {errorNombre}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="nombreCategoria">
                                        <i className="bi bi-tag me-2"></i>
                                        Nombre de la categoría <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nombreCategoria"
                                        value={nombreCategoria}
                                        onChange={handleNombreChange}
                                        className={errorNombre && !errorNombre.includes('existe') ? 'is-invalid' : ''}
                                        placeholder="Ej: Collares, Anillos, Pulseras..."
                                        maxLength={50}
                                        required
                                        disabled={guardando}
                                        autoFocus
                                    />
                                    <small className="char-count">
                                        {nombreCategoria.length}/50 caracteres
                                    </small>
                                    {errorNombre && !errorNombre.includes('existe') && (
                                        <span className="error-text">{errorNombre}</span>
                                    )}
                                </div>

                                {modoEdicion && (
                                    <div className="alert alert-warning">
                                        <i className="bi bi-info-circle"></i>
                                        Al modificar el nombre, todos los productos asociados se actualizarán automáticamente.
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn-cancelar"
                                    onClick={cerrarModal}
                                    disabled={guardando}
                                >
                                    <i className="bi bi-x-lg"></i>
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-guardar"
                                    disabled={guardando}
                                >
                                    {guardando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            {modoEdicion ? 'Actualizar' : 'Crear'} Categoría
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