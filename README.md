# 📚 Documentación Backend - Sistema KKarhua

## 📋 Tabla de Contenidos
1. [Instalación](#instalación)
2. [Ejecución](#ejecución)
3. [Credenciales de Prueba](#credenciales-de-prueba)
4. [Documentación de API](#documentación-de-api)
5. [Arquitectura](#arquitectura)

---

## 🚀 Instalación

### Requisitos Previos
- **Java JDK 21** o superior
- **MySQL 8.0** o superior
- **Maven 3.8+** (incluido en el wrapper del proyecto)
- **Git** (opcional, para clonar el repositorio)

### Pasos de Instalación

#### 1. Configurar Base de Datos MySQL

```sql
-- Crear la base de datos
CREATE DATABASE basedatos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar que se creó correctamente
SHOW DATABASES;
```

#### 2. Configurar application.properties

Editar `src/main/resources/application.properties`:

```properties
# Configuración de Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/basedatos?serverTimezone=UTC&useSSL=false
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_MYSQL

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
jwt.secret=mi-secreto-super-seguro-que-debe-tener-al-menos-256-bits-para-HS256-algoritmo-jwt-2024
```

#### 3. Instalar Dependencias

```bash
# En Windows (usando Maven Wrapper incluido)
./mvnw clean install

# En Linux/Mac
./mvnw clean install

# O si tienes Maven instalado globalmente
mvn clean install
```

#### 4. Crear Directorio de Uploads

```bash
# Crear directorio para imágenes de productos
mkdir -p uploads/productos
```

---

## ▶️ Ejecución

### Opción 1: Ejecutar con Maven Wrapper (Recomendado)

```bash
# Windows
./mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Opción 2: Ejecutar JAR compilado

```bash
# Compilar el proyecto
./mvnw clean package

# Ejecutar el JAR generado
java -jar target/fullrest-0.0.1-SNAPSHOT.jar
```

### Opción 3: Desde IDE (IntelliJ/Eclipse/VS Code)

1. Importar el proyecto como proyecto Maven
2. Localizar la clase `FullrestApplication.java`
3. Ejecutar como aplicación Java

### Verificar que está funcionando

El servidor se iniciará en: **http://localhost:8080**

Verificar accediendo a: **http://localhost:8080/swagger-ui/index.html**

---

## 🔐 Credenciales de Prueba

### Super Administrador

```json
{
  "email": "admin@kkarhua.com",
  "password": "Admin123"
}
```

**Permisos:**
- Gestión completa de usuarios
- Gestión de productos y categorías
- Gestión de stock
- Acceso a todas las funcionalidades


### Cliente

```json
{
  "email": "cliente@kkarhua.com",
  "password": "Cliente123"
}
```

**Permisos:**
- Ver productos y categorías
- Gestionar direcciones de envío
- Realizar compras

### Crear Usuarios de Prueba (Script SQL)

```sql
-- Insertar usuario Super Admin
INSERT INTO usuario (nombre, email, contrasena, rol, estado, fecha_creacion) 
VALUES (
    'Administrador Principal', 
    'admin@kkarhua.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', 
    'super-admin', 
    'activo', 
    NOW()
);


-- Insertar usuario Cliente
INSERT INTO usuario (nombre, email, contrasena, rol, estado, fecha_creacion) 
VALUES (
    'Juan Cliente', 
    'cliente@kkarhua.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', 
    'cliente', 
    'activo', 
    NOW()
);
```

> **Nota:** La contraseña encriptada corresponde a las contraseñas mencionadas arriba usando BCrypt.

---

## 📖 Documentación de API

### Acceso a Swagger UI

**URL:** http://localhost:8080/swagger-ui/index.html

Swagger proporciona documentación interactiva de todos los endpoints con:
- Descripción de cada endpoint
- Parámetros requeridos
- Ejemplos de request/response
- Posibilidad de probar endpoints directamente

### Endpoints Principales

#### 🔐 Autenticación

##### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@kkarhua.com",
  "password": "Admin123"
}

Response 200:
{
  "message": "Login exitoso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "nombre": "Administrador Principal",
    "email": "admin@kkarhua.com",
    "rol": "super-admin",
    "estado": "activo",
    "fechaCreacion": "2025-01-15T10:30:00"
  }
}
```

##### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response 200:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

##### Validar Token
```http
POST /api/auth/validate
Authorization: Bearer {token}

Response 200:
{
  "valid": true,
  "email": "admin@kkarhua.com",
  "rol": "super-admin",
  "userId": 1,
  "remainingTime": 82800000
}
```

##### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response 200:
{
  "message": "Logout exitoso. Por favor elimine los tokens del almacenamiento local."
}
```

---

#### 👤 Usuarios

##### Obtener todos los usuarios (Solo SUPER-ADMIN)
```http
GET /api/usuarios
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "nombre": "Administrador Principal",
    "email": "admin@kkarhua.com",
    "rol": "super-admin",
    "estado": "activo",
    "fechaCreacion": "2025-01-15T10:30:00"
  }
]
```

##### Obtener usuario por ID
```http
GET /api/usuarios/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "nombre": "Administrador Principal",
  "email": "admin@kkarhua.com",
  "rol": "super-admin",
  "estado": "activo",
  "fechaCreacion": "2025-01-15T10:30:00"
}
```

##### Crear nuevo usuario (Registro)
```http
POST /api/usuarios?autoLogin=true
Content-Type: application/json

{
  "nombre": "Pedro López",
  "email": "pedro@email.com",
  "contrasena": "Pedro123",
  "rol": "cliente"
}

Response 201:
{
  "message": "Usuario registrado exitosamente",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 4,
    "nombre": "Pedro López",
    "email": "pedro@email.com",
    "rol": "cliente",
    "estado": "activo"
  }
}
```

##### Actualizar usuario
```http
PUT /api/usuarios/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Pedro López Actualizado",
  "email": "pedro.lopez@email.com",
  "contrasena": "NuevaPass123",
  "rol": "cliente",
  "estado": "activo"
}

Response 200:
{
  "id": 4,
  "nombre": "Pedro López Actualizado",
  "email": "pedro.lopez@email.com",
  "rol": "super-admin",
  "estado": "activo",
  "fechaCreacion": "2025-01-15T10:30:00"
}
```

##### Eliminar usuario
```http
DELETE /api/usuarios/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 4,
  "nombre": "Pedro López",
  "email": "pedro@email.com",
  "rol": "cliente",
  "estado": "activo"
}
```

---

#### 📦 Productos

##### Obtener todos los productos (Público)
```http
GET /api/productos

Response 200:
[
  {
    "id": 1,
    "nombre": "Laptop HP",
    "descripcion": "Laptop HP 15.6 pulgadas",
    "precio": 500000,
    "stock": 10,
    "categoria": {
      "id": 1,
      "nombre": "Electrónica"
    },
    "imagen": "1705315200000.jpg",
    "estado": "activo",
    "fechaCreacion": "2025-01-15T10:30:00"
  }
]
```

##### Obtener producto por ID
```http
GET /api/productos/{id}

Response 200:
{
  "id": 1,
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP 15.6 pulgadas",
  "precio": 500000,
  "stock": 10,
  "categoria": {
    "id": 1,
    "nombre": "Electrónica"
  },
  "imagen": "1705315200000.jpg",
  "estado": "activo",
  "fechaCreacion": "2025-01-15T10:30:00"
}
```

##### Crear producto (SUPER-ADMIN)
```http
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Mouse Logitech",
  "descripcion": "Mouse inalámbrico Logitech MX Master 3",
  "precio": 80000,
  "stock": 25,
  "categoria": {
    "id": 1
  },
  "estado": "activo"
}

Response 201:
{
  "id": 2,
  "nombre": "Mouse Logitech",
  "descripcion": "Mouse inalámbrico Logitech MX Master 3",
  "precio": 80000,
  "stock": 25,
  "categoria": {
    "id": 1,
    "nombre": "Electrónica"
  },
  "imagen": null,
  "estado": "activo",
  "fechaCreacion": "2025-01-15T11:00:00"
}
```

##### Actualizar producto
```http
PUT /api/productos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Mouse Logitech MX Master 3S",
  "descripcion": "Mouse inalámbrico Logitech MX Master 3S - Última versión",
  "precio": 85000,
  "categoria": {
    "id": 1
  }
}

Response 200:
{
  "id": 2,
  "nombre": "Mouse Logitech MX Master 3S",
  "descripcion": "Mouse inalámbrico Logitech MX Master 3S - Última versión",
  "precio": 85000,
  "stock": 25,
  "categoria": {
    "id": 1,
    "nombre": "Electrónica"
  },
  "estado": "activo"
}
```

##### Eliminar producto
```http
DELETE /api/productos/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 2,
  "nombre": "Mouse Logitech",
  "estado": "activo"
}
```

---

#### 🏷️ Categorías

##### Obtener todas las categorías (Público)
```http
GET /api/categorias

Response 200:
[
  {
    "id": 1,
    "nombre": "Electrónica"
  },
  {
    "id": 2,
    "nombre": "Ropa"
  }
]
```

##### Obtener categoría por ID
```http
GET /api/categorias/{id}

Response 200:
{
  "id": 1,
  "nombre": "Electrónica"
}
```

##### Crear categoría (SUPER-ADMIN)
```http
POST /api/categorias
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Hogar"
}

Response 201:
{
  "id": 3,
  "nombre": "Hogar"
}
```

##### Actualizar categoría
```http
PUT /api/categorias/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Electrónica y Tecnología"
}

Response 200:
{
  "id": 1,
  "nombre": "Electrónica y Tecnología"
}
```

##### Eliminar categoría
```http
DELETE /api/categorias/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 3,
  "nombre": "Hogar"
}

Response 409 (Si tiene productos asociados):
{
  "error": "No se puede eliminar la categoría porque tiene productos asociados"
}
```

---

#### 📊 Stock

##### Consultar stock de producto
```http
GET /api/stock/{productoId}
Authorization: Bearer {token}

Response 200:
{
  "productoId": 1,
  "nombre": "Laptop HP",
  "stock": 10,
  "estado": "disponible"
}
```

##### Actualizar stock (establecer cantidad)
```http
PATCH /api/stock/{productoId}/actualizar
Authorization: Bearer {token}
Content-Type: application/json

{
  "stock": 50
}

Response 200:
{
  "productoId": 1,
  "nombre": "Laptop HP",
  "stockAnterior": 10,
  "stockActual": 50,
  "estado": "activo"
}
```

##### Agregar stock (incrementar)
```http
PATCH /api/stock/{productoId}/agregar
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad": 20
}

Response 200:
{
  "productoId": 1,
  "nombre": "Laptop HP",
  "stockAnterior": 50,
  "cantidadAgregada": 20,
  "stockActual": 70,
  "estado": "activo"
}
```

##### Reducir stock (disminuir)
```http
PATCH /api/stock/{productoId}/reducir
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad": 5
}

Response 200:
{
  "productoId": 1,
  "nombre": "Laptop HP",
  "stockAnterior": 70,
  "cantidadReducida": 5,
  "stockActual": 65,
  "estado": "activo"
}

Response 400 (Stock insuficiente):
{
  "error": "Stock insuficiente. Stock actual: 65"
}
```

---

#### 📍 Envíos (Direcciones)

##### Obtener todas las direcciones
```http
GET /api/envios
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "calle": "Av. Libertador 1234",
    "departamento": "Depto 501",
    "region": "Región Metropolitana",
    "comuna": "Santiago",
    "indicaciones": "Tocar timbre 501",
    "usuario": {
      "id": 1,
      "nombre": "Juan Cliente",
      "email": "juan@email.com"
    },
    "fechaCreacion": "2025-01-15T10:30:00",
    "fechaActualizacion": "2025-01-15T10:30:00"
  }
]
```

##### Obtener dirección por ID
```http
GET /api/envios/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "calle": "Av. Libertador 1234",
  "departamento": "Depto 501",
  "region": "Región Metropolitana",
  "comuna": "Santiago",
  "indicaciones": "Tocar timbre 501",
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente"
  },
  "fechaCreacion": "2025-01-15T10:30:00"
}
```

##### Obtener direcciones de un usuario
```http
GET /api/envios/usuario/{usuarioId}
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "calle": "Av. Libertador 1234",
    "region": "Región Metropolitana",
    "comuna": "Santiago",
    "usuario": {
      "id": 1,
      "nombre": "Juan Cliente"
    }
  }
]
```

##### Crear dirección de envío
```http
POST /api/envios
Authorization: Bearer {token}
Content-Type: application/json

{
  "calle": "Calle Los Alerces 567",
  "departamento": "Casa 12",
  "region": "Región Metropolitana",
  "comuna": "Providencia",
  "indicaciones": "Portón negro, casa con jardín",
  "usuarioId": 1
}

Response 201:
{
  "id": 2,
  "calle": "Calle Los Alerces 567",
  "departamento": "Casa 12",
  "region": "Región Metropolitana",
  "comuna": "Providencia",
  "indicaciones": "Portón negro, casa con jardín",
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente"
  },
  "fechaCreacion": "2025-01-15T11:00:00",
  "fechaActualizacion": "2025-01-15T11:00:00"
}
```

##### Actualizar dirección
```http
PUT /api/envios/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "calle": "Calle Nueva 999",
  "comuna": "Las Condes",
  "indicaciones": "Nueva indicación"
}

Response 200:
{
  "id": 2,
  "calle": "Calle Nueva 999",
  "comuna": "Las Condes",
  "indicaciones": "Nueva indicación",
  "fechaActualizacion": "2025-01-15T12:00:00"
}
```

##### Eliminar dirección
```http
DELETE /api/envios/{id}
Authorization: Bearer {token}

Response 200:
{
  "message": "Envío eliminado correctamente",
  "envioId": 2
}
```

---

#### 🛒 Compras

##### Obtener todas las compras
```http
GET /api/compras
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Juan Cliente"
    },
    "envio": {
      "id": 1,
      "calle": "Av. Libertador 1234",
      "comuna": "Santiago"
    },
    "subtotal": 420168,
    "iva": 79832,
    "total": 500000,
    "detalleProductos": "[{\"id\":1,\"nombre\":\"Laptop HP\",\"precio\":500000,\"cantidad\":1}]",
    "estado": "completada",
    "fechaCompra": "2025-01-15T10:30:00"
  }
]
```

##### Obtener compra por ID
```http
GET /api/compras/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente"
  },
  "envio": {
    "id": 1,
    "calle": "Av. Libertador 1234"
  },
  "subtotal": 420168,
  "iva": 79832,
  "total": 500000,
  "detalleProductos": "[{\"id\":1,\"nombre\":\"Laptop HP\",\"precio\":500000,\"cantidad\":1}]",
  "estado": "completada",
  "fechaCompra": "2025-01-15T10:30:00"
}
```

##### Obtener compras de un usuario
```http
GET /api/compras/usuario/{usuarioId}
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "total": 500000,
    "estado": "completada",
    "fechaCompra": "2025-01-15T10:30:00"
  }
]
```

##### Crear compra (Generar boleta)
```http
POST /api/compras
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario": {
    "id": 1
  },
  "envio": {
    "id": 1
  },
  "subtotal": 420168,
  "iva": 79832,
  "total": 500000,
  "detalleProductos": "[{\"id\":1,\"nombre\":\"Laptop HP\",\"precio\":500000,\"cantidad\":1}]"
}

Response 201:
{
  "id": 2,
  "usuario": {
    "id": 1,
    "nombre": "Juan Cliente"
  },
  "envio": {
    "id": 1
  },
  "subtotal": 420168,
  "iva": 79832,
  "total": 500000,
  "detalleProductos": "[{\"id\":1,\"nombre\":\"Laptop HP\",\"precio\":500000,\"cantidad\":1}]",
  "estado": "completada",
  "fechaCompra": "2025-01-15T11:30:00"
}
```

##### Obtener estadísticas de compras
```http
GET /api/compras/stats/totales
Authorization: Bearer {token}

Response 200:
{
  "totalCompras": 10,
  "fecha": "2025-01-15T12:00:00"
}
```

---

#### 🖼️ Imágenes

##### Subir imagen de producto
```http
POST /api/imagenes/upload/{productoId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [archivo_imagen.jpg]

Response 200:
{
  "fileName": "1705315200000.jpg",
  "fileDownloadUri": "http://localhost:8080/api/imagenes/1705315200000.jpg",
  "fileType": "image/jpeg",
  "size": "245678"
}
```

##### Obtener imagen
```http
GET /api/imagenes/{fileName}

Response 200:
[Imagen en formato binario]
Content-Type: image/jpeg
```

##### Eliminar imagen de producto
```http
DELETE /api/imagenes/{productoId}
Authorization: Bearer {token}

Response 200:
{
  "message": "Imagen eliminada correctamente"
}
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
fullrest/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/kkarhua/fullrest/
│   │   │       ├── config/           # Configuraciones (CORS, Security)
│   │   │       ├── controllers/      # Controladores Thymeleaf (vistas)
│   │   │       ├── entities/         # Entidades JPA
│   │   │       ├── repositories/     # Repositorios Spring Data
│   │   │       ├── restcontroller/   # REST Controllers (API)
│   │   │       ├── security/         # JWT y filtros de seguridad
│   │   │       ├── services/         # Lógica de negocio
│   │   │       └── validation/       # Validadores personalizados
│   │   └── resources/
│   │       ├── application.properties
│   │       └── templates/            # Plantillas Thymeleaf
│   └── test/                         # Tests unitarios
├── uploads/                          # Directorio de imágenes
├── pom.xml                           # Dependencias Maven
└── README.md
```

### Tecnologías Utilizadas

- **Spring Boot 3.5.0** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT (JJWT 0.12.5)** - Tokens de autenticación
- **Spring Data JPA** - Persistencia de datos
- **MySQL 8** - Base de datos relacional
- **Hibernate** - ORM
- **Bean Validation** - Validación de datos
- **Springdoc OpenAPI** - Documentación Swagger
- **BCrypt** - Encriptación de contraseñas
- **Maven** - Gestión de dependencias

### Modelo de Datos (Entidades)

#### Usuario
```java
- id: Long (PK)
- nombre: String
- email: String (unique)
- contrasena: String (encriptada)
- rol: String (cliente, super-admin)
- estado: String (activo, inactivo)
- fechaCreacion: LocalDateTime
```

#### Producto
```java
- id: Long (PK)
- nombre: String
- descripcion: String
- precio: int
- stock: int
- categoria: Categoria (FK)
- imagen: String (nombre archivo)
- estado: String (activo, agotado)
- fechaCreacion: LocalDateTime
```

#### Categoría
```java
- id: Long (PK)
- nombre: String (unique)
```

#### Envío
```java
- id: Long (PK)
- calle: String
- departamento: String (opcional)
- region: String
- comuna: String
- indicaciones: String (opcional)
- usuario: Usuario (FK)
- fechaCreacion: LocalDateTime
- fechaActualizacion: LocalDateTime
```

#### Compra
```java
- id: Long (PK)
- usuario: Usuario (FK)
- envio: Envio (FK)
- subtotal: Integer
- iva: Integer
- total: Integer
- detalleProductos: String (JSON)
- estado: String (completada, pendiente, cancelada)
- fechaCompra: LocalDateTime
```

### Seguridad

#### Configuración JWT

- **Access Token:** 24 horas de duración
- **Refresh Token:** 7 días de duración
- **Algoritmo:** HS256
- **Secret Key:** Configurable en `application.properties`

#### Roles y Permisos

| Endpoint | CLIENTE | SUPER-ADMIN |
|----------|---------|----------|-------------|
| GET /api/productos | ✅ | ✅ | ✅ |
| POST /api/productos | ❌ | ✅ | ✅ |
| PUT /api/productos | ❌ | ✅ | ✅ |
| DELETE /api/productos | ❌ | ✅ | ✅ |
| GET /api/usuarios | ❌ | ❌ | ✅ |
| POST /api/usuarios | ✅ | ✅ | ✅ |
| PUT /api/usuarios | ❌ | ❌ | ✅ |
| DELETE /api/usuarios | ❌ | ❌ | ✅ |
| /api/stock/* | ❌ | ✅ | ✅ |
| /api/envios/* | ✅ | ✅ | ✅ |
| /api/compras/* | ✅ | ✅ | ✅ |

### CORS

Orígenes permitidos:
- http://localhost:5173 (Vite dev server)
- http://localhost:5174
- http://127.0.0.1:5173

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
./mvnw test

# Ejecutar tests específicos
./mvnw test -Dtest=CategoriaServiceImplTest

# Con reporte de cobertura
./mvnw clean test jacoco:report
```

### Tests Disponibles

- `CategoriaServiceImplTest` - Tests de servicio de categorías
- `CompraServiceImplTest` - Tests de servicio de compras
- `EnvioServiceImplTest` - Tests de servicio de envíos
- `UsuarioServiceImplTest` - Tests de servicio de usuarios
- `JwtUtilTest` - Tests de utilidad JWT
---

## 🔧 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solución:** Verificar credenciales MySQL en `application.properties`

### Error: "Port 8080 is already in use"

**Solución:** Cambiar puerto en `application.properties`:
```properties
server.port=8081
```

### Error: "Table doesn't exist"

**Solución:** Verificar que `spring.jpa.hibernate.ddl-auto=update` en properties

### Error 401 Unauthorized

**Solución:** Verificar que el token JWT sea válido y no haya expirado

### Error CORS

**Solución:** Verificar origen en `SecurityConfig.java` y `CorsConfig.java`
