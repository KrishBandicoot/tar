import { useState, useEffect } from 'react';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import './Home.css';

export function Home() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/productos');
            
            if (!response.ok) {
                throw new Error('Error al conectar con el servidor');
            }

            const data = await response.json();
            setProductos(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en el puerto 8080');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Navbar sin contenedor para que ocupe todo el ancho */}
            <Navbar />

            {/* Auth Links */}
            <div className="auth-links">
                <a href="#">Iniciar Sesion</a> | <a href="#">Registrar</a>
            </div>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>TIENDA ONLINE</h1>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis 
                                mollitia dioribus nesciunt molestiae. Tenetur temporibus neque 
                                natus sint dolores tempora laboriosam ea possimus cum mollita 
                                nesciunt esse, modi molestiae illum!
                            </p>
                            <button className="btn btn-success">✓ Ver productos</button>
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
                                            src={producto.imagen} 
                                            className="card-img-top" 
                                            alt={producto.nombre}
                                        />
                                        <span className="badge-price">${producto.precio}</span>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{producto.nombre}</h5>
                                        <p className="card-text flex-grow-1">{producto.descripcion}</p>
                                        <button className="btn btn-outline-primary w-100 mt-auto">
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