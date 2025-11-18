import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import './ListaProductos.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function ListaProductos() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todos');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
    const [mostrarFiltros, setMostrarFiltros] = useState(true);

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/productos`);
            
            if (!response.ok) {
                throw new Error('Error al conectar con el servidor');
            }

            const data = await response.json();
            setProductos(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const response = await fetch(`${API_BASE_URL}/categorias`);
            
            if (!response.ok) {
                throw new Error('Error al cargar categorías');
            }

            const data = await response.json();
            setCategorias(data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        } finally {
            setLoadingCategorias(false);
        }
    };

    const handleVerProducto = (id) => {
        navigate(`/producto/${id}`);
    };

    const getImageUrl = (producto) => {
        if (!producto.imagen) {
            return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        }
        if (producto.imagen.startsWith('http')) {
            return producto.imagen;
        }
        return `${API_BASE_URL}/imagenes/${producto.imagen}`;
    };

    // Filtrar productos según estado y categoría
    const productosFiltrados = productos.filter(producto => {
        // Filtro por estado
        let pasaFiltroEstado = true;
        if (filtro === 'activos') pasaFiltroEstado = producto.estado === 'activo';
        if (filtro === 'inactivos') pasaFiltroEstado = producto.estado !== 'activo';

        // Filtro por categoría
        let pasaFiltroCategoria = true;
        if (categoriaSeleccionada !== 'todas') {
            // Verificar si producto.categoria es un objeto o un string
            const categoriaId = typeof producto.categoria === 'object' && producto.categoria !== null
                ? producto.categoria.id
                : null;
            pasaFiltroCategoria = categoriaId === parseInt(categoriaSeleccionada);
        }

        return pasaFiltroEstado && pasaFiltroCategoria;
    });

    // Contar productos por categoría
    const contarPorCategoria = (categoriaId) => {
        if (categoriaId === 'todas') {
            return productos.length;
        }
        return productos.filter(p => p.categoria?.id === parseInt(categoriaId)).length;
    };

    return (
        <>
            <Navbar />
            
            <div className="lista-productos-container">
                <div className="container">
                    <div className="lista-productos-header">
                        <h1>Todos los Productos</h1>
                        <p className="text-muted">
                            Explora nuestro catálogo completo de productos
                        </p>
                    </div>

                    {/* Contenedor de filtros */}
                    <div className="row mb-4">
                        {/* Sidebar de filtros */}
                        <div className="col-lg-3 col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">Filtros</h6>
                                    <button 
                                        className="btn btn-sm btn-link text-white p-0"
                                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                    >
                                        <i className={`bi bi-chevron-${mostrarFiltros ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>
                                
                                {mostrarFiltros && (
                                    <div className="card-body">
                                        {/* Filtro por Estado */}
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3">Estado</h6>
                                            <div className="btn-group-vertical w-100" role="group">
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm text-start ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setFiltro('todos')}
                                                >
                                                    Todos ({productos.length})
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm text-start ${filtro === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setFiltro('activos')}
                                                >
                                                    Activos ({productos.filter(p => p.estado === 'activo').length})
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm text-start ${filtro === 'inactivos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setFiltro('inactivos')}
                                                >
                                                    Inactivos ({productos.filter(p => p.estado !== 'activo').length})
                                                </button>
                                            </div>
                                        </div>

                                        {/* Separador */}
                                        <hr />

                                        {/* Filtro por Categoría */}
                                        <div>
                                            <h6 className="fw-bold mb-3">Categorías</h6>
                                            {loadingCategorias ? (
                                                <div className="text-center py-3">
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="list-group">
                                                    <button
                                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                                                            categoriaSeleccionada === 'todas' ? 'active' : ''
                                                        }`}
                                                        onClick={() => setCategoriaSeleccionada('todas')}
                                                    >
                                                        <span>Todas</span>
                                                        <span className="badge bg-secondary rounded-pill">
                                                            {contarPorCategoria('todas')}
                                                        </span>
                                                    </button>
                                                    
                                                    {categorias.map((categoria) => (
                                                        <button
                                                            key={categoria.id}
                                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                                                                categoriaSeleccionada === categoria.id.toString() ? 'active' : ''
                                                            }`}
                                                            onClick={() => setCategoriaSeleccionada(categoria.id.toString())}
                                                        >
                                                            <span>{categoria.nombre}</span>
                                                            <span className={`badge rounded-pill ${
                                                                categoriaSeleccionada === categoria.id.toString() 
                                                                    ? 'bg-light text-dark' 
                                                                    : 'bg-secondary'
                                                            }`}>
                                                                {contarPorCategoria(categoria.id)}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Botón para limpiar filtros */}
                                        {(filtro !== 'todos' || categoriaSeleccionada !== 'todas') && (
                                            <div className="mt-3">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary w-100"
                                                    onClick={() => {
                                                        setFiltro('todos');
                                                        setCategoriaSeleccionada('todas');
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    Limpiar filtros
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Área de productos */}
                        <div className="col-lg-9 col-md-8">
                            {/* Indicador de filtros activos */}
                            {(filtro !== 'todos' || categoriaSeleccionada !== 'todas') && (
                                <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                                    <span>
                                        <i className="bi bi-funnel me-2"></i>
                                        Filtros activos: 
                                        {filtro !== 'todos' && <span className="ms-2 badge bg-primary">{filtro}</span>}
                                        {categoriaSeleccionada !== 'todas' && (
                                            <span className="ms-2 badge bg-primary">
                                                {categorias.find(c => c.id.toString() === categoriaSeleccionada)?.nombre}
                                            </span>
                                        )}
                                    </span>
                                    <span className="badge bg-secondary">
                                        {productosFiltrados.length} resultado(s)
                                    </span>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-3">Cargando productos...</p>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <h4 className="alert-heading">Error de conexión</h4>
                                    <p>{error}</p>
                                    <hr />
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={cargarProductos}
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            {!loading && !error && productosFiltrados.length > 0 && (
                                <div className="row g-4">
                                    {productosFiltrados.map((producto) => (
                                        <div key={producto.id} className="col-12 col-sm-6 col-lg-4">
                                            <div className={`card h-100 product-card ${producto.estado !== 'activo' ? 'producto-inactivo' : ''}`}>
                                                <div className="card-img-container">
                                                    <img 
                                                        src={getImageUrl(producto)} 
                                                        className="card-img-top" 
                                                        alt={producto.nombre}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                                                        }}
                                                    />
                                                    <span className="badge-price">
                                                        ${producto.precio?.toLocaleString('es-CL')}
                                                    </span>
                                                    {producto.estado !== 'activo' && (
                                                        <span className="badge-estado">
                                                            {producto.estado || 'Inactivo'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{producto.nombre}</h5>
                                                    <p className="card-text flex-grow-1">
                                                        {producto.descripcion && producto.descripcion.length > 100 
                                                            ? producto.descripcion.substring(0, 100) + '...' 
                                                            : producto.descripcion}
                                                    </p>
                                                    <div className="card-footer-info">
                                                        <small className="text-muted">
                                                            Stock: {producto.stock || 0} unidades
                                                        </small>
                                                        <small className="text-muted">
                                                            <span className="badge bg-light text-dark">
                                                                {producto.categoria?.nombre || 'Sin categoría'}
                                                            </span>
                                                        </small>
                                                    </div>
                                                    <button 
                                                        className="btn btn-outline-primary w-100 mt-2"
                                                        onClick={() => handleVerProducto(producto.id)}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && !error && productosFiltrados.length === 0 && (
                                <div className="alert alert-info text-center" role="alert">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No hay productos que coincidan con los filtros seleccionados.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}