const BASE_URL = "http://localhost:8080/api";

// ======= AUTH =======
export const login = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
};

// ======= USERS =======
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`);
  if (!res.ok) throw new Error("Usuario no encontrado");
  return res.json();
};

export const createUser = async (user) => {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return res.json();
};

// ======= PRODUCTS =======
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
};

// ======= STOCK =======
export const updateStock = async (id, stock) => {
  const res = await fetch(`${BASE_URL}/stock/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) throw new Error("Error al actualizar stock");
  return res.json();
};

// ======= IMAGE =======
export const uploadProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/images/${id}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir imagen");
  return res.json();
};
