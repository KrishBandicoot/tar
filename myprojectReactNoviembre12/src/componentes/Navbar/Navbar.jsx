// src/componentes/Navbar/Navbar.jsx
import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';

export function Navbar(){
    const { obtenerCantidadTotal } = useCarrito();
    const cantidadItems = obtenerCantidadTotal();

    return (
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark container-fluid">
                <div className="container-fluid">
                <h3 style={{marginTop: 20, marginBottom: 20,
                        color: "white", padding: 15}}>Kkarhua</h3>                
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