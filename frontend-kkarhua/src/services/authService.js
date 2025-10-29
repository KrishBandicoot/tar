import api from './api';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    
    // Guardar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};