import { useState } from 'react';
import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import './Contacto.css';

export function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        comentario: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log('Datos del formulario:', formData);
        alert('Mensaje enviado exitosamente');
        
        // Limpiar el formulario
        setFormData({
            nombre: '',
            email: '',
            comentario: ''
        });
    };

    return (
        <>
            <Navbar />
            
            <div className="contacto-container">
                <div className="container">
                    <div className="contacto-header">
                        <h1>Kkarhua</h1>
                    </div>

                    <div className="contacto-content">
                        <div className="form-section">
                            <h2 className="form-title">Formulario de Contacto</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre completo:</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Correo"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="comentario">Comentario</label>
                                    <textarea
                                        id="comentario"
                                        name="comentario"
                                        rows="5"
                                        value={formData.comentario}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-enviar">
                                    ENVIAR MENSAJE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}