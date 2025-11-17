import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import './Home.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Home() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            // Filtrar solo productos activos y limitar a 8
            const productosActivos = data
                .filter(p => p.estado === 'activo')
                .slice(0, 8);
            setProductos(productosActivos);
            setError(null);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en el puerto 8080');
        } finally {
            setLoading(false);
        }
    };

    const handleVerProducto = (id) => {
        navigate(`/producto/${id}`);
    };

    const handleVerTodosProductos = () => {
        navigate('/lista-productos');
    };

    // Función para obtener la URL completa de la imagen
    const getImageUrl = (producto) => {
        if (!producto.imagen) {
            return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        }
        // Si la imagen ya es una URL completa, la retornamos tal cual
        if (producto.imagen.startsWith('http')) {
            return producto.imagen;
        }
        // Si no, construimos la URL usando el endpoint de imágenes
        return `${API_BASE_URL}/imagenes/${producto.imagen}`;
    };

    return (
        <>
            {/* Navbar sin contenedor para que ocupe todo el ancho */}
            <Navbar />

            {/* Auth Links */}
            <div className="auth-links">
                <a href="IniciarSesion">Iniciar Sesion</a> | <a href="Registrar">Registrar</a>
            </div>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>TIENDA ONLINE</h1>
                            <p>
                                Bienvenido a Kkarhua, nuestra tienda online de joyería, donde encontrarás las piezas más exclusivas y elegantes para cada ocasión.
                            </p>
                        </div>
                        <div className="hero-image">
                            <img 
                                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop" 
                                alt="Joyería destacada" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container products-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Productos Destacados</h2>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={handleVerTodosProductos}
                    >
                        Ver todos los productos →
                    </button>
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
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

                {!loading && !error && productos.length > 0 && (
                    <div className="row g-4">
                        {productos.map((producto) => (
                            <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100 product-card">
                                    <div className="card-img-container">
                                        <img 
                                            src={getImageUrl(producto)} 
                                            className="card-img-top" 
                                            alt={producto.nombre}
                                            onError={(e) => {
                                                // Si la imagen falla al cargar, mostrar placeholder
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                                            }}
                                        />
                                        <span className="badge-price">${producto.precio?.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{producto.nombre}</h5>
                                        <p className="card-text flex-grow-1">
                                            {producto.descripcion && producto.descripcion.length > 80 
                                                ? producto.descripcion.substring(0, 80) + '...' 
                                                : producto.descripcion}
                                        </p>
                                        <button 
                                            className="btn btn-outline-primary w-100 mt-auto"
                                            onClick={() => handleVerProducto(producto.id)}
                                        >
                                            Ver Producto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && productos.length === 0 && (
                    <div className="alert alert-info text-center" role="alert">
                        No hay productos disponibles en este momento.
                    </div>
                )}
            </div>

            
            <Footer />
        </>
    );
}