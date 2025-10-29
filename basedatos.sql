-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2025 a las 04:02:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `basedatos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` bigint(20) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` int(11) NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `categoria`, `descripcion`, `estado`, `fecha_creacion`, `imagen`, `nombre`, `precio`, `stock`) VALUES
(4, NULL, NULL, 'activo', '2025-10-29 01:48:46.000000', NULL, NULL, 0, 0),
(5, 'Collares', 'Collar hecho de filas de Perlas y con gemas de colores', 'activo', '2025-10-29 01:50:25.000000', '1761705021142.jpg', 'Collar de Perlas', 25990, 10),
(6, 'Collares', 'Collar hecho de filas de Perlas y con gemas de colores', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Collar de Perlas', 25990, 10),
(7, 'Collares', 'Collar de Sonic the Hedgehog', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Collar de Sonic', 999999, 5),
(8, 'Collares', 'Collar de moda, Cadena De Acero Inoxidable estilo Y2k', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Collar de acero inoxidable', 1500, 15),
(9, 'Anillos', '4 Piezas/set Conjunto De Anillos De Estilo Punk Con Forma De Cabeza De Calavera', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Anillos Calavera', 2500, 20),
(10, 'Anillos', 'Anillo unisex personalidad vintage negro gota de aceite con diseño de cruz abierto ajustable', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Anillo Vintage Negro', 1000, 12),
(11, 'Collares', 'Gargantilla con forma de cono versátil y creativa a la moda', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Gargantilla', 1500, 8),
(12, 'Aros', 'Par De Pendientes Minimalistas De Remaches De Acero Inoxidable', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Pendientes De Acero Inoxidables', 1500, 25),
(13, 'Collares', 'Collar Colgante De Plata En Forma De Gato Mascota Vintage', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Collar Colgante De Plata', 2000, 15),
(14, 'Pulseras', 'Pulsera hecha a mano con cuentas de piedra natural y cierre ajustable.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Pulsera de Cuentas Naturales', 3990, 18),
(15, 'Anillos', 'Set de 5 anillos minimalistas en tonos dorados y plateados.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Set de Anillos Minimalistas', 2500, 10),
(16, 'Aros', 'Aros colgantes con diseño de estrella, ideales para ocasiones especiales.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Aros Colgantes Estrella', 1800, 15),
(17, 'Otros', 'Tobillera estilo boho con dijes y cuentas de colores.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Tobillera Boho', 2200, 12),
(18, 'Broches', 'Broche vintage con diseño floral y detalles en cristal.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Broche Vintage', 1200, 8),
(19, 'Collares', 'Collar personalizado con el nombre que elijas, en acero inoxidable.', 'activo', '2025-10-28 23:05:07.000000', NULL, 'Collar Personalizado con Nombre', 4500, 20),
(20, 'Collares', 'Collar hecho de filas de Perlas y con gemas de colores', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Collar de Perlas', 25990, 10),
(21, 'Collares', 'Collar de Sonic the Hedgehog', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Collar de Sonic', 999999, 5),
(22, 'Collares', 'Collar de moda, Cadena De Acero Inoxidable estilo Y2k', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Collar de acero inoxidable', 1500, 15),
(23, 'Anillos', '4 Piezas/set Conjunto De Anillos De Estilo Punk Con Forma De Cabeza De Calavera', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Anillos Calavera', 2500, 20),
(24, 'Anillos', 'Anillo unisex personalidad vintage negro gota de aceite con diseño de cruz abierto ajustable', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Anillo Vintage Negro', 1000, 12),
(25, 'Collares', 'Gargantilla con forma de cono versátil y creativa a la moda', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Gargantilla', 1500, 8),
(26, 'Aros', 'Par De Pendientes Minimalistas De Remaches De Acero Inoxidable', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Pendientes De Acero Inoxidables', 1500, 25),
(27, 'Collares', 'Collar Colgante De Plata En Forma De Gato Mascota Vintage', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Collar Colgante De Plata', 2000, 15),
(28, 'Pulseras', 'Pulsera hecha a mano con cuentas de piedra natural y cierre ajustable.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Pulsera de Cuentas Naturales', 3990, 18),
(29, 'Anillos', 'Set de 5 anillos minimalistas en tonos dorados y plateados.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Set de Anillos Minimalistas', 2500, 10),
(30, 'Aros', 'Aros colgantes con diseño de estrella, ideales para ocasiones especiales.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Aros Colgantes Estrella', 1800, 15),
(31, 'Otros', 'Tobillera estilo boho con dijes y cuentas de colores.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Tobillera Boho', 2200, 12),
(32, 'Broches', 'Broche vintage con diseño floral y detalles en cristal.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Broche Vintage', 1200, 8),
(33, 'Collares', 'Collar personalizado con el nombre que elijas, en acero inoxidable.', 'activo', '2025-10-28 23:05:18.000000', NULL, 'Collar Personalizado con Nombre', 4500, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `contrasena`, `email`, `estado`, `fecha_creacion`, `nombre`, `rol`) VALUES
(2, '$2a$10$QhqXQL055RP4MbnaWQTSd.F2PtHk.wH7hJzz0XPcSkD9oZVL.XARS', 'mariana.torres@example.com', 'activo', '2025-10-24 17:44:41.000000', 'Mariana Torres', 'cliente'),
(3, '$2a$10$8ZqE5xJ.Y3vH5F6oK9L2nOGxYXqJ8E0vH5F6oK9L2nOGxYXqJ8E0v', 'cr.lizamad@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Cristian Lizama Diaz', 'super-admin'),
(4, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO', '1234@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Taylor Hebert', 'cliente'),
(5, '$2a$10$YHKpZ8nF1Y7gE5xJ.Y3vH5F6oK9L2nOGxYXqJ8E0vH5F6oK9L2n', '123456@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Miguel Arrallana', 'cliente'),
(6, '$2a$10$pQ7R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8G7H6I5J4K3L2M1N0O9P', 'lucia.gonzalez@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Lucía González', 'cliente'),
(7, '$2a$10$qR8S2T1U0V9W8X7Y6Z5A4B3C2D1E0F9G8H7I6J5K4L3M2N1O0P9Q', 'juan.perez@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Juan Pérez', 'cliente'),
(8, '$2a$10$rS9T2U1V0W9X8Y7Z6A5B4C3D2E1F0G9H8I7J6K5L4M3N2O1P0Q9R', 'valentina.soto@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Valentina Soto', 'vendedor'),
(9, '$2a$10$sT0U2V1W0X9Y8Z7A6B5C4D3E2F1G0H9I8J7K6L5M4N3O2P1Q0R9S', 'carlos.rivas@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Carlos Rivas', 'cliente'),
(10, '$2a$10$tU1V2W0X9Y8Z7A6B5C4D3E2F1G0H9I8J7K6L5M4N3O2P1Q0R9S0T', 'fernanda.torres@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Fernanda Torres', 'vendedor'),
(11, '$2a$10$uV2W1X0Y9Z8A7B6C5D4E3F2G1H0I9J8K7L6M5N4O3P2Q1R0S9T0U', 'matias.ramirez@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Matías Ramírez', 'cliente'),
(12, '$2a$10$vW3X2Y1Z0A9B8C7D6E5F4G3H2I1J0K9L8M7N6O5P4Q3R2S1T0U9V', 'sofia.castro@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Sofía Castro', 'cliente'),
(13, '$2a$10$wX4Y3Z2A1B0C9D8E7F6G5H4I3J2K1L0M9N8O7P6Q5R4S3T2U1V0W', 'diego.fuentes@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Diego Fuentes', 'cliente'),
(14, '$2a$10$xY5Z4A3B2C1D0E9F8G7H6I5J4K3L2M1N0O9P8Q7R6S5T4U3V2W1X', 'camila.herrera@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Camila Herrera', 'vendedor'),
(15, '$2a$10$yZ6A5B4C3D2E1F0G9H8I7J6K5L4M3N2O1P0Q9R8S7T6U5V4W3X2Y', 'felipe.morales@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Felipe Morales', 'cliente'),
(16, '$2a$10$zA7B6C5D4E3F2G1H0I9J8K7L6M5N4O3P2Q1R0S9T8U7V6W5X4Y3Z', 'TestAdmin2@gmail.com', 'activo', '2025-10-28 23:11:02.000000', 'Test Admin2', 'cliente'),
(17, '$2a$10$AB8C7D6E5F4G3H2I1J0K9L8M7N6O5P4Q3R2S1T0U9V8W7X6Y5Z4A', 'oooooooooooooo@duoc.cl', 'activo', '2025-10-28 23:11:02.000000', 'iiiiiiiiiiiiiiii 44444444444', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
