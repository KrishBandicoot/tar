import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import './Navbar.css';

export function Navbar() {
    const navigate = useNavigate();
    const { obtenerCantidadTotal } = useCarrito();
    const cantidadItems = obtenerCantidadTotal();

    const handleCarritoClick = () => {
        navigate('/carrito');
        // Cerrar el menú hamburguesa si está abierto
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarToggler?.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark" 
             style={{ 
                 width: '100vw', 
                 marginLeft: 'calc(-50vw + 50%)', 
                 marginRight: 'calc(-50vw + 50%)'
             }}>
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
                            <button 
                                className="nav-link position-relative"
                                onClick={handleCarritoClick}
                                style={{ 
                                    background: 'none', 
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'inherit'
                                }}
                            >
                                <i className="bi bi-cart3"></i>
                                {cantidadItems > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cantidadItems}
                                    </span>
                                )}
                            </button>
                        </li> 
                    </ul>
                </div>                
            </div>
        </nav> 
    );
}