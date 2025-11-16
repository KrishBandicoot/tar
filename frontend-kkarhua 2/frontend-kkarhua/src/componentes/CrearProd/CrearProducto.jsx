import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';

const API_BASE_URL = "http://localhost:8080/api";

export function CrearProducto() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías');
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProducto(prev => ({
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : value) : value
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Validaciones
    if (!producto.nombre.trim()) {
      setError('El nombre del producto es obligatorio');
      setLoading(false);
      return;
    }

    if (!producto.precio || parseFloat(producto.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      setLoading(false);
      return;
    }

    if (!producto.categoria) {
      setError('Debe seleccionar una categoría');
      setLoading(false);
      return;
    }

    try {
      const productoData = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: parseFloat(producto.precio),
        categoria: { id: parseInt(producto.categoria) }
      };

      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const data = await response.json();
      console.log('Producto creado:', data);
      
      setSuccessMessage('¡Producto creado exitosamente!');
      
      // Limpiar formulario
      setProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: ''
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/inventario');
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      setError('Error al crear el producto. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar y volver
  const handleCancel = () => {
    navigate('/inventario');
  };

  return (
    <>
      <div className="container">
        <Navbar />
        
        <div className="row mt-4">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                <h3>Crear Nuevo Producto</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del Producto <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={producto.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre del producto"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      rows="3"
                      value={producto.descripcion}
                      onChange={handleChange}
                      placeholder="Ingrese la descripción del producto"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">
                      Precio <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">
                      Categoría <span className="text-danger">*</span>
                    </label>
                    {loadingCategorias ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Cargando categorías...</span>
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        id="categoria"
                        name="categoria"
                        value={producto.categoria}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || loadingCategorias}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Producto'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}