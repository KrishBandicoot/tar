import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../Navbar/AdminNavbar';
import { Sidebar } from '../Sidebar/Sidebar';
import './CrearProducto.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function CrearProducto() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '0',
    categoria: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const menuItems = [
    { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
    { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
    { icon: 'bi-plus-circle', label: 'Crear Producto', path: '/crear-producto' },
    { icon: 'bi-people', label: 'Usuarios', path: '/usuarios' },
    { icon: 'bi-person-plus', label: 'Crear Usuario', path: '/crear-usuario' },
    { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
    { icon: 'bi-house', label: 'Inicio', path: '/' }
  ];

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      setError('No se pudieron cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return;
      }
      setArchivoImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // PASO 1: Crear el producto (SIN stock, SIN estado, SIN imagen)
      const productoParaEnviar = {
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion.trim(),
        precio: parseFloat(producto.precio),
        categoria: { id: parseInt(producto.categoria) }
      };

      console.log('📦 Creando producto:', productoParaEnviar);

      const token = localStorage.getItem('accessToken');
      const responseProducto = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productoParaEnviar)
      });

      if (!responseProducto.ok) {
        const errorData = await responseProducto.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el producto');
      }

      const productoCreado = await responseProducto.json();
      console.log('✅ Producto creado con ID:', productoCreado.id);

      // PASO 2: Actualizar el stock (usando el endpoint de stock)
      if (producto.stock && parseInt(producto.stock) > 0) {
        console.log('📊 Actualizando stock a:', producto.stock);
        
        const responseStock = await fetch(`${API_BASE_URL}/stock/${productoCreado.id}/actualizar`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ stock: parseInt(producto.stock) })
        });

        if (!responseStock.ok) {
          console.warn('⚠️ Error al actualizar stock, pero producto creado');
        } else {
          console.log('✅ Stock actualizado correctamente');
        }
      }

      // PASO 3: Subir la imagen si existe
      if (archivoImagen) {
        console.log('📸 Subiendo imagen para producto ID:', productoCreado.id);
        
        const formData = new FormData();
        formData.append('file', archivoImagen);

        const responseImagen = await fetch(`${API_BASE_URL}/imagenes/upload/${productoCreado.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!responseImagen.ok) {
          console.warn('⚠️ Producto creado pero error al subir imagen');
          alert('⚠️ Producto creado, pero hubo un error al subir la imagen');
        } else {
          console.log('✅ Imagen subida correctamente');
        }
      }

      alert('✅ Producto creado exitosamente');
      navigate('/productos');

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const tieneContenido = Object.values(producto).some(val => val !== '' && val !== '0') || archivoImagen;
    if (!tieneContenido || window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
      navigate('/productos');
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-wrapper">
        <Sidebar menuItems={menuItems} currentPath="/crear-producto" />
        <main className="admin-main">
          <div className="crear-producto-container" style={{ padding: 0, background: 'transparent', minHeight: 'auto' }}>
            <div className="form-card">
              <h2>Crear Nuevo Producto</h2>

              {error && (
                <div className="error-message">
                  {error}
                  <button onClick={() => setError(null)} className="error-close">×</button>
                </div>
              )}

              {loadingCategorias ? (
                <div className="loading">Cargando categorías...</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Imagen del producto */}
                  <div className="form-group">
                    <label>Imagen del producto</label>
                    <div className="imagen-upload-section" style={{ textAlign: 'center' }}>
                      <div className="imagen-preview" style={{ 
                        width: '100%', maxWidth: '300px', height: '200px', margin: '0 auto 15px',
                        border: '2px dashed #dee2e6', borderRadius: '8px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', overflow: 'hidden'
                      }}>
                        {imagenPreview ? (
                          <img src={imagenPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ textAlign: 'center', color: '#6c757d' }}>
                            <i className="bi bi-image" style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}></i>
                            <span style={{ fontSize: '14px' }}>Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImagenChange} id="imagen-input" style={{ display: 'none' }} disabled={loading} />
                      <label htmlFor="imagen-input" className="btn-cambiar-imagen" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        background: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px',
                        cursor: 'pointer', fontSize: '14px', fontWeight: '500'
                      }}>
                        <i className="bi bi-camera"></i>
                        {imagenPreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                      </label>
                      <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '10px' }}>
                        Formato: JPG, PNG. Tamaño máximo: 5MB
                      </p>
                    </div>
                  </div>

                  {/* Fila: Nombre y Precio */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre del producto <span className="required">*</span></label>
                      <input type="text" id="nombre" name="nombre" value={producto.nombre} onChange={handleChange}
                        disabled={loading} maxLength={100} placeholder="Ej: Collar de plata" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="precio">Precio <span className="required">*</span></label>
                      <div className="price-input">
                        <span className="currency">$</span>
                        <input type="number" id="precio" name="precio" step="1" min="1" value={producto.precio}
                          onChange={handleChange} disabled={loading} placeholder="15000" required />
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción <span className="required">*</span></label>
                    <textarea id="descripcion" name="descripcion" rows="4" value={producto.descripcion}
                      onChange={handleChange} disabled={loading} maxLength={500}
                      placeholder="Descripción detallada del producto..." required />
                    <small className="char-count">{producto.descripcion.length}/500 caracteres</small>
                  </div>

                  {/* Fila: Stock y Categoría */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="stock">Stock <span className="required">*</span></label>
                      <input type="number" id="stock" name="stock" min="0" value={producto.stock}
                        onChange={handleChange} disabled={loading} placeholder="0" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="categoria">Categoría <span className="required">*</span></label>
                      <select id="categoria" name="categoria" value={producto.categoria} onChange={handleChange}
                        disabled={loading || categorias.length === 0} required>
                        <option value="">Seleccionar...</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                      </select>
                      {categorias.length === 0 && !loadingCategorias && (
                        <small className="error-text">No hay categorías disponibles</small>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="form-actions">
                    <button type="submit" disabled={loading || categorias.length === 0} className="btn-primary">
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Crear Producto
                        </>
                      )}
                    </button>
                    <button type="button" onClick={handleCancel} disabled={loading} className="btn-secondary">
                      <i className="bi bi-x-lg me-2"></i>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}