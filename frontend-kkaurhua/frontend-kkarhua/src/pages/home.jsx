import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Home = () => {
  return (
    <>
      <Navbar />
      
      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <Link to="/login">Iniciar Sesion</Link>
        |
        <Link to="/register">Registrar</Link>
      </div>

      <div className="hero">
        <div className="hero-text">
          <h1>TIENDA ONLINE</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
          <button>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Ver productos</Link>
            </li>
          </button>
        </div>

        <div className="hero-image">
          <img src="img/collar.jpg" alt="Imagen Productos" width="200px" height="200px" />
        </div>
      </div>

      <div className="row">
        {/* Productos destacados */}
        <div className="col-md-3 mb-5">
          <div className="card">
            <span className="price-badge">$25.990</span>
            <img className="card-img-top" src="img/collar.jpg" alt="Collar" />
            <div className="card-body text-center">
              <h4 className="card-title">Collar de Perlas</h4>
              <p className="card-text">Collar hecho de filas de Perlas y con gemas de colores</p>
              <Link to="/detalle-producto" className="btn btn-outline-primary">Ver Producto</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-5">
          <div className="card">
            <span className="price-badge">$999.999</span>
            <img className="card-img-top" src="img/SONIC.png" alt="SONIC" />
            <div className="card-body text-center">
              <h4 className="card-title">Collar de Sonic</h4>
              <p className="card-text">Collar de Sonic the Hedgehog</p>
              <Link to="/detalle-producto" className="btn btn-outline-primary">Ver Producto</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-5">
          <div className="card">
            <span className="price-badge">$1.500</span>
            <img className="card-img-top" src="img/collar_de_moda.png" alt="Collar" />
            <div className="card-body text-center">
              <h4 className="card-title">Collar de acero inoxidable</h4>
              <p className="card-text">Collar de moda, Cadena De Acero Inoxidable estilo Y2k</p>
              <Link to="/detalle-producto" className="btn btn-outline-primary">Ver Producto</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-5">
          <div className="card">
            <span className="price-badge">$2.500</span>
            <img className="card-img-top" src="img/Anillos_De Estilo_Punk_Con_Forma_De_Cabeza_De_Calavera.png" alt="Anillos" />
            <div className="card-body text-center">
              <h4 className="card-title">Anillos Calavera</h4>
              <p className="card-text">4 Piezas/set Conjunto De Anillos De Estilo Punk Con Forma De Cabeza De Calavera</p>
              <Link to="/detalle-producto" className="btn btn-outline-primary">Ver Producto</Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-sm bg-dark navbar-dark container-fluid">
        <div className="container-fluid">
          <h3 style={{ marginTop: '20px', marginBottom: '20px', color: 'white', padding: '15px' }}>
            Kkarhua
          </h3>
        </div>
        <form action="" method="post" style={{ width: '350px', margin: '0 auto' }}>
          <label htmlFor="nom" style={{ marginBottom: '8px', color: 'white' }}>¡Recibe Noticias!</label>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="Correo" required id="nom" minLength="10"
              style={{ border: '2px solid #222', padding: '10px' }} />
            <button type="submit" style={{ background: 'gray', color: 'white', padding: '8px 15px', marginLeft: '10px', marginRight: '5px' }}>
              Subscribirse
            </button>
          </div>
        </form>
      </nav>
      <Footer />
    </>
  );
};