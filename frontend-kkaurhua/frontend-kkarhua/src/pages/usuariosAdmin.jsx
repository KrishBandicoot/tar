import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { getUsers, deleteUser, updateUser } from '../../services/api';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [searchTerm, filterRol, usuarios]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarUsuarios = () => {
    let resultado = [...usuarios];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultado = resultado.filter(u => 
        u.nombre.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    if (filterRol !== 'todos') {
      resultado = resultado.filter(u => u.rol === filterRol);
    }

    setFilteredUsuarios(resultado);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await deleteUser(id);
      setSuccessMessage('Usuario eliminado correctamente');
      cargarUsuarios();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al eliminar usuario: ' + err.message);
    }
  };

  const handleCambiarEstado = async (usuario) => {
    try {
      const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      await updateUser(usuario.id, { ...usuario, estado: nuevoEstado });
      setSuccessMessage(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      cargarUsuarios();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Usuarios</h1>
            <Link to="/admin/usuarios/agregar" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Usuario
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
            </div>
          )}

          {/* Filtros */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={filterRol}
                    onChange={(e) => setFilterRol(e.target.value)}
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="cliente">Clientes</option>
                    <option value="vendedor">Vendedores</option>
                    <option value="super-admin">Administradores</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterRol('todos');
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha Creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <i className="bi bi-inbox fs-1 text-muted"></i>
                            <p className="text-muted mt-2">No se encontraron usuarios</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsuarios.map(usuario => (
                          <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.email}</td>
                            <td>
                              <span className={`badge ${
                                usuario.rol === 'super-admin' ? 'bg-danger' :
                                usuario.rol === 'vendedor' ? 'bg-primary' :
                                'bg-secondary'
                              }`}>
                                {usuario.rol}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                usuario.estado === 'activo' ? 'bg-success' : 'bg-warning text-dark'
                              }`}>
                                {usuario.estado}
                              </span>
                            </td>
                            <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <Link 
                                  to={`/admin/usuarios/modificar/${usuario.id}`}
                                  className="btn btn-outline-primary"
                                  title="Editar"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button 
                                  className="btn btn-outline-warning"
                                  onClick={() => handleCambiarEstado(usuario)}
                                  title={usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                >
                                  <i className={`bi ${usuario.estado === 'activo' ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(usuario.id)}
                                  title="Eliminar"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-3 text-muted">
                  Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}