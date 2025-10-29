import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { getProductById, updateProduct, uploadProductImage } from '../../services/api';

export default function ModificarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    estado: 'activo'
  });
  
  const [imagenActual, setImagenActual] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const categorias = ['Collares', 'Anillos', 'Pulseras', 'Aros', 'Broches', 'Otros'];

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoadingData(true);
      const data = await getProductById(id);
      
      setFormData({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        stock: data.stock,
        categoria: data.categoria,
        estado: data.estado
      });
      
      setImagenActual(data.imagen || '');
      setShowAlert(data.stock < 5);
    } catch (err) {
      setError('Error al cargar producto: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (id === 'stock') {
      const stockValue = parseInt(value);
      setShowAlert(stockValue < 5 && stockValue >= 0);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB');
        return;
      }
      setNuevaImagen(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseInt(formData.precio),
        stock: parseInt(formData.stock),
        categoria: formData.categoria,
        estado: formData.estado,
        imagen: imagenActual
      };

      await updateProduct(id, productoData);

      // Si hay nueva imagen, subirla
      if (nuevaImagen) {
        try {
          await uploadProductImage(id, nuevaImagen);
        } catch (imgError) {
          console.error('Error al subir imagen:', imgError);
        }
      }

      alert('Producto actualizado exitosamente');
      navigate('/admin/productos');
    } catch (err) {
      setError(err.message || 'Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <div className="col-md-10 main-content">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando producto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content">
          <div className="row justify-content-center" style={{ marginTop: '25px' }}>
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Modificar Producto</h1>
                <button 
                  onClick={() => navigate('/admin/productos')}
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </button>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del producto <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre" 
                      value={formData.nombre}
                      onChange={handleChange}
                      required 
                      minLength="3"
                      maxLength="100"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="categoria" className="form-label">
                      Categoría <span className="text-danger">*</span>
                    </label>
                    <select 
                      className="form-control" 
                      id="categoria" 
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccione categoría</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea 
                    className="form-control" 
                    id="descripcion" 
                    rows="3"
                    value={formData.descripcion}
                    onChange={handleChange}
                    maxLength="500"
                    disabled={loading}
                  ></textarea>
                  <small className="text-muted">{formData.descripcion.length}/500 caracteres</small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="precio" className="form-label">
                      Precio <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="precio" 
                        value={formData.precio}
                        onChange={handleChange}
                        required 
                        min="0" 
                        step="1"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="stock" className="form-label">
                      Stock <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="stock" 
                      value={formData.stock}
                      onChange={handleChange}
                      required 
                      min="0" 
                      step="1"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Imagen actual</label>
                  {imagenActual && (
                    <div className="mb-2">
                      <img 
                        src={`http://localhost:8000/api/imagenes/${imagenActual}`}
                        alt="Imagen actual"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        className="img-thumbnail"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Sin+imagen';
                        }}
                      />
                    </div>
                  )}
                  
                  <label htmlFor="imagen" className="form-label">Cambiar imagen</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="imagen" 
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={loading}
                  />
                  <small className="text-muted">Tamaño máximo: 5MB</small>
                  
                  {nuevaImagen && (
                    <div className="mt-2">
                      <p className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Nueva imagen seleccionada: {nuevaImagen.name}
                      </p>
                      <img 
                        src={URL.createObjectURL(nuevaImagen)} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select 
                    className="form-control" 
                    id="estado" 
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {showAlert && (
                  <div className="alert alert-warning" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    ¡Alerta! El stock está en nivel crítico (menos de 5 unidades).
                  </div>
                )}
                
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/admin/productos')}
                    className="btn btn-outline-secondary me-2"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Actualizar Producto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}