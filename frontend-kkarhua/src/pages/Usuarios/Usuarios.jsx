import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../../componentes/Navbar/AdminNavbar';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import './Usuarios.css';

const API_BASE_URL = 'http://localhost:8080/api';

export function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [guardandoUsuario, setGuardandoUsuario] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const menuItems = [
        { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
        { icon: 'bi-box-seam', label: 'Productos', path: '/productos' },
        { icon: 'bi-plus-circle', label: 'Crear Producto', path: '/crear-producto' },
        { icon: 'bi-people', label: 'Usuarios', path: '/usuarios' },
        { icon: 'bi-person-plus', label: 'Crear Usuario', path: '/crear-usuario' },
        { icon: 'bi-tag', label: 'Categorías', path: '/categorias' },
        { icon: 'bi-shop', label: 'Ver Tienda', path: '/lista-productos' },
        { icon: 'bi-house', label: 'Inicio', path: '/' }
    ];

    useEffect(() => {
        cargarUsuarios();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === '') {
            setUsuariosFiltrados(usuarios);
        } else {
            const filtrados = usuarios.filter(user =>
                user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                user.email.toLowerCase().includes(busqueda.toLowerCase())
            );
            setUsuariosFiltrados(filtrados);
        }
    }, [busqueda, usuarios]);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsuarios(data);
            setUsuariosFiltrados(data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar usuario');

            alert('Usuario eliminado exitosamente');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el usuario');
        }
    };

    const abrirModalEditar = (usuario) => {
        setUsuarioEditar({
            ...usuario,
            contrasena: '' // No mostramos la contraseña encriptada
        });
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setUsuarioEditar(null);
        setShowPassword(false);
    };

    const handleCambioUsuario = (e) => {
        const { name, value } = e.target;
        setUsuarioEditar(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardarUsuario = async (e) => {
        e.preventDefault();
        setGuardandoUsuario(true);

        try {
            const token = localStorage.getItem('accessToken');
            const usuarioActualizado = {
                nombre: usuarioEditar.nombre,
                email: usuarioEditar.email,
                rol: usuarioEditar.rol,
                estado: usuarioEditar.estado
            };

            // Solo incluir contraseña si fue modificada
            if (usuarioEditar.contrasena && usuarioEditar.contrasena.trim() !== '') {
                usuarioActualizado.contrasena = usuarioEditar.contrasena;
            }

            const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioEditar.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(usuarioActualizado)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar usuario');
            }

            alert('✅ Usuario actualizado exitosamente');
            cerrarModal();
            cargarUsuarios();
        } catch (error) {
            alert('Error al guardar cambios: ' + error.message);
        } finally {
            setGuardandoUsuario(false);
        }
    };

    const getRolBadgeClass = (rol) => {
        switch(rol) {
            case 'super-admin': return 'bg-danger';
            case 'vendedor': return 'bg-primary';
            case 'cliente': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const getEstadoBadgeClass = (estado) => {
        return estado === 'activo' ? 'bg-success' : 'bg-secondary';
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-wrapper">
                <Sidebar menuItems={menuItems} currentPath="/usuarios" />

                <main className="admin-main">
                    <div className="usuarios-header">
                        <h1 className="page-title">Gestión de Usuarios</h1>
                    </div>

                    <div className="search-bar">
                        <div className="search-input-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar por nombre o email..."
                                value={busqueda}
                                onChange={handleBusquedaChange}
                            />
                            {busqueda && (
                                <button 
                                    className="clear-search"
                                    onClick={() => setBusqueda('')}
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            )}
                        </div>
                        <div className="search-results-count">
                            {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? 's' : ''} encontrado{usuariosFiltrados.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando usuarios...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-people empty-icon"></i>
                            <h3>No se encontraron usuarios</h3>
                            <p>
                                {busqueda 
                                    ? `No hay usuarios que coincidan con "${busqueda}"`
                                    : 'Aún no hay usuarios registrados'}
                            </p>
                        </div>
                    ) : (
                        <div className="usuarios-table-container">
                            <table className="usuarios-table">
                                <thead>
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
                                    {usuariosFiltrados.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.id}</td>
                                            <td className="usuario-nombre">
                                                <i className="bi bi-person-circle me-2"></i>
                                                {usuario.nombre}
                                            </td>
                                            <td className="usuario-email">{usuario.email}</td>
                                            <td>
                                                <span className={`badge ${getRolBadgeClass(usuario.rol)}`}>
                                                    {usuario.rol}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${getEstadoBadgeClass(usuario.estado)}`}>
                                                    {usuario.estado}
                                                </span>
                                            </td>
                                            <td className="usuario-fecha">
                                                {new Date(usuario.fechaCreacion).toLocaleDateString('es-CL')}
                                            </td>
                                            <td>
                                                <div className="usuario-acciones">
                                                    <button 
                                                        className="btn-editar-small"
                                                        onClick={() => abrirModalEditar(usuario)}
                                                        title="Editar usuario"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-eliminar-small"
                                                        onClick={() => handleEliminar(usuario.id, usuario.nombre)}
                                                        title="Eliminar usuario"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Modificar Usuario</h2>
                            <button className="modal-close" onClick={cerrarModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleGuardarUsuario}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={usuarioEditar.nombre}
                                        onChange={handleCambioUsuario}
                                        required
                                        minLength={3}
                                        maxLength={100}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={usuarioEditar.email}
                                        onChange={handleCambioUsuario}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Nueva Contraseña (opcional)</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="contrasena"
                                            value={usuarioEditar.contrasena}
                                            onChange={handleCambioUsuario}
                                            placeholder="Dejar vacío para no cambiar"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                    <small className="text-muted">
                                        Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número
                                    </small>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Rol *</label>
                                        <select
                                            name="rol"
                                            value={usuarioEditar.rol}
                                            onChange={handleCambioUsuario}
                                            required
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="vendedor">Vendedor</option>
                                            <option value="super-admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estado *</label>
                                        <select
                                            name="estado"
                                            value={usuarioEditar.estado}
                                            onChange={handleCambioUsuario}
                                            required
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn-cancelar"
                                    onClick={cerrarModal}
                                    disabled={guardandoUsuario}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-guardar"
                                    disabled={guardandoUsuario}
                                >
                                    {guardandoUsuario ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-2"></i>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}