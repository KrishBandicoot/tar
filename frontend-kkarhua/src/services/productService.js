import api from './api';

export const getAllProducts = async () => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener productos');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/productos', productData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al crear el producto');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/productos/${id}`, productData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al actualizar el producto');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
};

export const changeProductStatus = async (id, estado) => {
  try {
    const response = await api.patch(`/productos/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    throw new Error('Error al cambiar el estado del producto');
  }
};

export const getProductsByCategory = async (categoriaId) => {
  try {
    const response = await api.get(`/productos/categoria/${categoriaId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener productos por categoría');
  }
};

export const getLowStockProducts = async (limite = 5) => {
  try {
    const response = await api.get(`/productos/stock-bajo?limite=${limite}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener productos con stock bajo');
  }
};