import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="mb-3">Kkarhua</h5>
            <p className="text-muted">
              Tu tienda de accesorios de confianza. Calidad y estilo en cada producto.
            </p>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/home" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/productos" className="text-muted text-decoration-none">Productos</Link>
              </li>
              <li className="mb-2">
                <Link to="/nosotros" className="text-muted text-decoration-none">Nosotros</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-muted text-decoration-none">Blog</Link>
              </li>
              <li className="mb-2">
                <Link to="/contacto" className="text-muted text-decoration-none">Contacto</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="mb-3">Contacto</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>Santiago, Chile
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>+56 9 1234 5678
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>info@kkarhua.cl
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="mb-3">Síguenos</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted text-decoration-none fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none fs-4">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none fs-4">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} Kkarhua. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="#" className="text-muted text-decoration-none me-3">Términos y Condiciones</Link>
            <Link to="#" className="text-muted text-decoration-none">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};