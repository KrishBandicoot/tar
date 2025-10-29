import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Nosotros = () => {
  return (
    <>
      <Navbar />
      
      <div className="hero">
        <div className="hero-text">
          <h1>¿Que es este sitio?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
        </div>
      </div>
      
      <div className="hero">
        <div className="hero-text">
          <h1>¿Donde nos ubicamos?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
        </div>
      </div>
      
      <div className="hero">
        <div className="hero-text">
          <h1>¿Quienes trabajan con nosotros?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Blanditiis mollitia doloribus nesciunt molestias. 
            Tenetur temporibus neque natus sint dolores tempora laboriosam ea possimus cum mollitia nesciunt esse, modi molestiae illum!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};