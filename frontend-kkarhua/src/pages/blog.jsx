import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from './Footer';

export const Blog = () => {
  return (
    <>
      <Navbar />
      
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#222' }}>NOTICIAS IMPORTANTES</h1>
      </div>

      <div className="hero">
        <div className="hero-text">
          <h1>Dato Curioso #1</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
          <button>
            <li className="nav-item">
              <a className="nav-link">Más Información</a>
            </li>
          </button>
        </div>

        <div className="hero-image">
          <img src="img/collar.jpg" alt="Imagen_Noticia1" width="400px" height="250px" />
        </div>
      </div>

      <div className="hero">
        <div className="hero-text">
          <h1>Dato Curioso #2</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
          <button>
            <li className="nav-item">
              <a className="nav-link">Más Información</a>
            </li>
          </button>
        </div>

        <div className="hero-image">
          <img src="img/collar.jpg" alt="Imagen_Noticia2" width="400px" height="250px" />
        </div>
      </div>
      <Footer />
    </>
  );
};