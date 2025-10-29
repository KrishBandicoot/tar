import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';

export const AgregarProducto = () => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockCritico: '',
    categoria: '',
    imagen: null
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'imagen') {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }

    // Check critical stock alert
    if (id === 'stock' || id === 'stockCritico') {
      const stock = id === 'stock' ? parseInt(value) : parseInt(formData.stock);
      const stockCritico = id === 'stockCritico' ? parseInt(value) : parseInt(formData.stockCritico);
      setShowAlert(stock <= stockCritico && !isNaN(stock) && !isNaN(stockCritico));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Producto agregado:', formData);
    // Aquí iría la lógica para enviar el producto al backend
    alert('Producto agregado exitosamente');
  };

  return (
    <>
      <AdminSidebar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 main-content">
            <div className="row justify-content-center" style={{ marginTop: '25px' }}>
              <div className="col-md-6">
                <h1 className="mt-2 mb-4" style={{ textAlign: 'center' }}>Agregar Producto</h1>
                <form id="form-producto" className="formulario-fondo p-4 rounded" onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label htmlFor="codigo" className="form-label">Código producto</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="codigo" 
                      value={formData.codigo}
                      onChange={handleChange}
                      required 
                      minLength="3" 
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre" 
                      value={formData.nombre}
                      onChange={handleChange}
                      required 
                      maxLength="100" 
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea 
                      className="form-control" 
                      id="descripcion" 
                      value={formData.descripcion}
                      onChange={handleChange}
                      maxLength="500"
                    ></textarea>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="precio" 
                      value={formData.precio}
                      onChange={handleChange}
                      required 
                      min="0" 
                      step="0.01" 
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="stock" 
                      value={formData.stock}
                      onChange={handleChange}
                      required 
                      min="0" 
                      step="1" 
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="stockCritico" className="form-label">Stock Crítico</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="stockCritico" 
                      value={formData.stockCritico}
                      onChange={handleChange}
                      min="0" 
                      step="1" 
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <select 
                      className="form-control" 
                      id="categoria" 
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione categoría</option>
                      <option value="Collares">Collares</option>
                      <option value="Anillos">Anillos</option>
                      <option value="Pulseras">Pulseras</option>
                      <option value="Aros">Aros</option>
                      <option value="Broches">Broches</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="imagen" className="form-label">Imagen</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="imagen" 
                      onChange={handleChange}
                      accept="image/*" 
                    />
                  </div>
                  <div className="text-center mt-4" style={{ marginBottom: '5px' }}>
                    <input type="submit" value="Agregar Producto" className="btn btn-outline-success me-2" />
                  </div>
                </form>
                {showAlert && (
                  <div id="alerta-stock" className="alert alert-warning mt-3">
                    ¡Alerta! El stock está en el nivel crítico.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};