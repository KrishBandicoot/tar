export function Footer() {
    return (
        <footer className="footer-component" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
            <div className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <h5 className="fw-bold mb-3">Kkarhua</h5>
                            <p className="text-white small">
                                Tu tienda online de confianza para joyería y accesorios de moda.
                            </p>
                        </div>
                        
                        <div className="col-md-4 mb-3 mb-md-0">
                            <h6 className="fw-bold mb-3">Enlaces Rápidos</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a href="/" className="text-white text-decoration-none small">
                                        Home
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="/lista-productos" className="text-white text-decoration-none small">
                                        Productos
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="/contacto" className="text-white text-decoration-none small">
                                        Contacto
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3">Síguenos</h6>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-white">
                                    <i className="bi bi-facebook fs-5"></i>
                                </a>
                                <a href="#" className="text-white">
                                    <i className="bi bi-instagram fs-5"></i>
                                </a>
                                <a href="#" className="text-white">
                                    <i className="bi bi-twitter fs-5"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="my-4 bg-secondary" />
                    
                    <div className="text-center">
                        <p className="mb-0 text-white small">
                            © {new Date().getFullYear()} Kkarhua. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}