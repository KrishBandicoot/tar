import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import './ListaProductos.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function ListaProductos() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'activos', 'inactivos'

    useEffect(() => {
        cargarProductos();
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

    const handleVerProducto = (id) => {
        navigate(`/producto/${id}`);
    };

    // Función para obtener la URL completa de la imagen
    const getImageUrl = (producto) => {
        if (!producto.imagen) {
            return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        }
        if (producto.imagen.startsWith('http')) {
            return producto.imagen;
        }
        return `${API_BASE_URL}/imagenes/${producto.imagen}`;
    };

    // Filtrar productos según el estado seleccionado
    const productosFiltrados = productos.filter(producto => {
        if (filtro === 'todos') return true;
        if (filtro === 'activos') return producto.estado === 'activo';
        if (filtro === 'inactivos') return producto.estado !== 'activo';
        return true;
    });

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

                    {/* Filtros */}
                    <div className="filtros-section mb-4">
                        <div className="btn-group" role="group">
                            <button 
                                type="button" 
                                className={`btn ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFiltro('todos')}
                            >
                                Todos ({productos.length})
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filtro === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFiltro('activos')}
                            >
                                Activos ({productos.filter(p => p.estado === 'activo').length})
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filtro === 'inactivos' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFiltro('inactivos')}
                            >
                                Inactivos ({productos.filter(p => p.estado !== 'activo').length})
                            </button>
                        </div>
                    </div>

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
                                <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
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
                                                    Categoría: {producto.categoria || 'Sin categoría'}
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
                            No hay productos que coincidan con el filtro seleccionado.
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}