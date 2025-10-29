import api from './api';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener usuarios');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al crear el usuario');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al actualizar el usuario');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el usuario');
  }
};

export const changeUserStatus = async (id, estado) => {
  try {
    const response = await api.patch(`/usuarios/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    throw new Error('Error al cambiar el estado del usuario');
  }
};

export const getUsersByRole = async (rol) => {
  try {
    const response = await api.get(`/usuarios/rol/${rol}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener usuarios por rol');
  }
};