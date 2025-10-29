import { Link } from 'react-router-dom';

const UserTable = ({ users, onStatusChange }) => {
  const getRoleBadgeColor = (rol) => {
    const colors = {
      'cliente': 'bg-blue-100 text-blue-800',
      'vendedor': 'bg-green-100 text-green-800',
      'super-admin': 'bg-purple-100 text-purple-800'
    };
    return colors[rol] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusToggle = (user) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
    const confirmMessage = newStatus === 'inactivo'
      ? `¿Está seguro de desactivar al usuario "${user.nombre}"?`
      : `¿Está seguro de activar al usuario "${user.nombre}"?`;

    if (window.confirm(confirmMessage)) {
      onStatusChange(user.id, newStatus);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando un nuevo usuario.
        </p>
        <div className="mt-6">
          <Link
            to="/usuarios/crear"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Crear Usuario
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className={user.estado === 'inactivo' ? 'bg-gray-50 opacity-75' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">
                          {user.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.nombre}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.rol)}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.fechaCreacion).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/usuarios/editar/${user.id}`}
                    className={`text-indigo-600 hover:text-indigo-900 mr-4 ${
                      user.estado === 'inactivo' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={(e) => user.estado === 'inactivo' && e.preventDefault()}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleStatusToggle(user)}
                    className={`${
                      user.estado === 'inactivo'
                        ? 'text-green-600 hover:text-green-900'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                  >
                    {user.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;