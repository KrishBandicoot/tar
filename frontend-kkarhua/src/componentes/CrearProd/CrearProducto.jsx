import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../componentes/Navbar/Navbar';

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