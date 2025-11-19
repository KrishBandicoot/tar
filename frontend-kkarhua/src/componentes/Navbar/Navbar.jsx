import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import './Navbar.css';

export function Navbar() {
    const { obtenerCantidadTotal } = useCarrito();
    const cantidadItems = obtenerCantidadTotal();
    
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Si estamos en la parte superior, siempre mostrar el navbar
            if (currentScrollY <= 10) {
                setIsVisible(true);
                setLastScrollY(currentScrollY);
                return;
            }

            // Si hacemos scroll hacia abajo, ocultar navbar
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } 
            // Si hacemos scroll hacia arriba, mostrar navbar
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        // Agregar el event listener con throttle para mejor rendimiento
        let ticking = false;
        const scrollListener = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollListener);

        // Cleanup
        return () => window.removeEventListener('scroll', scrollListener);
    }, [lastScrollY]);

    return (
        <nav className={`navbar navbar-expand-sm bg-dark navbar-dark container-fluid ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="container-fluid">
                <h3 style={{ color: "white" }}>Kkarhua</h3>                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"> 
                            <Link className="nav-link active" to="/">Home</Link> 
                        </li> 
                        <li className="nav-item"> 
                            <Link className="nav-link" to="/lista-productos">Productos</Link> 
                        </li> 
                        <li className="nav-item"> 
                            <Link className="nav-link" to="/contacto">Contacto</Link> 
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link position-relative" to="/carrito">
                                <i className="bi bi-cart3"></i>
                                {cantidadItems > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cantidadItems}
                                    </span>
                                )}
                            </Link>
                        </li> 
                    </ul>
                </div>                
            </div>
        </nav> 
    );
}