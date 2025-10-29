import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';

export const ModUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(usuariosGuardados);
  };

  const editarUsuario = (usuario) => {
    setUsuarioEdit(usuario);
    setEditando(true);
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    
    const usuariosActualizados = usuarios.map(u => 
      u.id === usuarioEdit.id ? usuarioEdit : u
    );
    
    localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
    setUsuarios(usuariosActualizados);
    setEditando(false);
    setUsuarioEdit(null);
    alert('Usuario actualizado correctamente');
  };

  const eliminarUsuario = (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      const usuariosFiltrados = usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(usuariosFiltrados));
      setUsuarios(usuariosFiltrados);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content">
          <h1 className="mt-2 mb-4" style={{ textAlign: 'center' }}>Modificar Usuario</h1>
          
          <div className="container mt-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Fecha Nacimiento</th>
                  <th>Tipo de Usuario</th>
                  <th>Región</th>
                  <th>Comuna</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.run}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellidos}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.fechaNacimiento}</td>
                    <td>{usuario.tipoUsuario}</td>
                    <td>{usuario.region}</td>
                    <td>{usuario.comuna}</td>
                    <td>{usuario.direccion}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-1" 
                        onClick={() => editarUsuario(usuario)}>Editar</button>
                      <button className="btn btn-sm btn-danger" 
                        onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {editando && (
              <form onSubmit={guardarCambios} className="mt-4">
                <h4 className="mb-3" style={{ textAlign: 'center' }}>Editar Usuario</h4>
                
                <div className="mb-2">
                  <label htmlFor="edit-run" className="form-label">RUN</label>
                  <input type="text" className="form-control" id="edit-run" required
                    value={usuarioEdit.run}
                    onChange={(e) => setUsuarioEdit({...usuarioEdit, run: e.target.value})} />
                </div>
                
                <div className="mb-2">
                  <label htmlFor="edit-nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="edit-nombre" required
                    value={usuarioEdit.nombre}
                    onChange={(e) => setUsuarioEdit({...usuarioEdit, nombre: e.target.value})} />
                </div>
                
                <div className="mb-2">
                  <label htmlFor="edit-apellidos" className="form-label">Apellidos</label>
                  <input type="text" className="form-control" id="edit-apellidos" required
                    value={usuarioEdit.apellidos}
                    onChange={(e) => setUsuarioEdit({...usuarioEdit, apellidos: e.target.value})} />
                </div>
                
                <button type="submit" className="btn btn-success">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary ms-2" 
                  onClick={() => { setEditando(false); setUsuarioEdit(null); }}>
                  Cancelar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};